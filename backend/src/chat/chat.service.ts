import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatResponse } from './dto/chat.dto';

@Injectable()
export class ChatService implements OnModuleInit {
  private gemini;
  private chat;
  private readonly apiKey: string;
  private readonly SYSTEM_PROMPT = `You are an AI veterinary assistant designed to help pet owners with their pet health questions. Your role is to:

1. Provide reliable, accurate, and actionable pet care information
2. Answer questions about pet health and wellness
3. Help identify potential symptoms and suggest appropriate next steps
4. Offer emergency guidance when needed
5. Share preventive care and wellness tips

Important guidelines:
- Always prioritize pet safety and well-being
- Recommend veterinary consultation for serious concerns
- Provide breed-specific advice when relevant
- Base responses on current veterinary standards
- Be clear about limitations and when professional vet care is needed
- Keep responses clear, concise, and easy to understand
- Maintain context from previous messages in the conversation
- Ask clarifying questions when needed for better diagnosis

Remember: You are not a replacement for professional veterinary care. Always advise seeking veterinary attention for serious or emergency situations.`;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
  }

  onModuleInit() {
    const genAI = new GoogleGenerativeAI(this.apiKey);
    this.gemini = genAI.getGenerativeModel({
      model: this.configService.get<string>('GEMINI_AI_MODEL') || 'gemini-pro',
    });
    
    // Initialize chat with system prompt and configuration
    this.initializeChat();
  }

  private initializeChat() {
    this.chat = this.gemini.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'Please confirm your role as a veterinary assistant.' }],
        },
        {
          role: 'model',
          parts: [{ text: this.SYSTEM_PROMPT }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7, // Balanced between creativity and consistency
        topP: 0.8, // Nucleus sampling for more focused responses
        topK: 40, // Limit vocabulary diversity for more precise medical terminology
      },
    });
  }

  async handleMessage(content: string): Promise<{ message: ChatResponse }> {
    const startTime = Date.now();
    try {
      // Send message and get response
      const result = await this.chat.sendMessage(content);
      const response = await result.response;

      const endTime = Date.now();
      console.log(`Gemini API response time: ${endTime - startTime}ms`);

      const aiMessage: ChatResponse = {
        id: Date.now().toString(),
        content: response.text(),
        role: 'assistant',
        timestamp: Date.now(),
      };

      return { message: aiMessage };
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // If there's an error with the chat session, try to reinitialize it
      if (error.message?.includes('session')) {
        console.log('Reinitializing chat session...');
        this.initializeChat();
        return this.handleMessage(content); // Retry the message
      }
      
      throw error;
    }
  }
} 