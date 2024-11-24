import { Injectable, OnModuleInit, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatResponse } from './dto/chat.dto';
import { Pet } from '../pet/dto/pet.dto';
import { RateLimiter } from 'limiter';

@Injectable()
export class ChatService implements OnModuleInit {
  private gemini;
  private readonly apiKey: string;
  private rateLimiter: RateLimiter;
  private chatSessions: Map<string, any> = new Map();

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    this.apiKey = apiKey;
    
    this.rateLimiter = new RateLimiter({
      tokensPerInterval: 60,
      interval: 'minute',
    });
  }

  onModuleInit() {
    const genAI = new GoogleGenerativeAI(this.apiKey);
    this.gemini = genAI.getGenerativeModel({
      model: this.configService.get<string>('GEMINI_AI_MODEL') || 'gemini-pro',
    });
  }

  private async checkRateLimit() {
    const hasToken = await this.rateLimiter.tryRemoveTokens(1);
    if (!hasToken) {
      throw new HttpException(
        'Too many requests. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS
      );
    }
  }

  private generatePetContext(pet: Pet): string {
    const medicalHistory = pet.medicalHistory
      .sort((a, b) => b.date - a.date)
      .map(record => `
        Date: ${new Date(record.date).toLocaleDateString()}
        Symptoms: ${record.symptoms}
        Diagnosis: ${record.diagnosis}
        Treatment: ${record.treatment}
        ${record.notes ? `Notes: ${record.notes}` : ''}
      `).join('\n---\n');

    return `
      You are a veterinary AI assistant. Here is the context about the pet you're helping with:
      Name: ${pet.name}
      Species: ${pet.species}
      Breed: ${pet.breed || 'Not specified'}
      Age: ${pet.age} years
      Weight: ${pet.weight} kg

      Medical History:
      ${medicalHistory || 'No medical history available'}

      Please consider this information when providing advice. Keep responses focused on this specific pet's characteristics and history.
      Wait for the user to ask questions about their pet's health.
    `;
  }

  private generateSystemPrompt(pet?: Pet): string {
    const basePrompt = `
      You are a veterinary AI assistant. Your role is to:
      1. Provide helpful information about pet health and care
      2. Answer questions and concerns from pet owners
      3. Suggest when it's necessary to visit a real veterinarian
      4. Always maintain a professional and caring tone
      5. Wait for the user to ask questions, don't ask them for information
      
      Important: You should not diagnose conditions or prescribe treatments. Instead, provide general information and guidance, and recommend professional veterinary care when appropriate.
    `;

    if (pet) {
      return `${basePrompt}\n${this.generatePetContext(pet)}`;
    }

    return basePrompt;
  }

  private generateGreeting(pet?: Pet): string {
    if (pet) {
      return `Hello! I'm your AI veterinary assistant. I can see that ${pet.name} is a ${pet.age}-year-old ${pet.breed ? `${pet.breed} ` : ''}${pet.species}. 
      ${pet.medicalHistory.length > 0 
        ? "I have access to their medical history and will consider it in our discussion." 
        : "I see they don't have any medical records yet."}
      
      How can I help you with ${pet.name}'s health today?`;
    }

    return `Hello! I'm your AI veterinary assistant. I'm here to help answer your questions about pet health and care. 
    While I can provide general guidance, please remember that for specific medical concerns, it's always best to consult with a veterinarian directly.
    
    What questions do you have about pet health?`;
  }

  private getOrCreateChatSession(sessionId: string, pet?: Pet): any {
    if (!this.chatSessions.has(sessionId)) {
      const chat = this.gemini.startChat({
        history: [{
          role: 'user',
          parts: [{ text: 'Please understand and follow these instructions: ' + this.generateSystemPrompt(pet) }],
        }, {
          role: 'model',
          parts: [{ text: 'I understand and will follow these instructions.' }],
        }],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
        },
      });
      this.chatSessions.set(sessionId, chat);
    }
    return this.chatSessions.get(sessionId);
  }

  async handleMessage(content: string, pet?: Pet, userId?: string): Promise<{ message: ChatResponse }> {
    try {
      await this.checkRateLimit();

      const sessionId = userId ? (pet ? `${userId}_${pet.id}` : `${userId}_general`) : 'default';
      const chat = this.getOrCreateChatSession(sessionId, pet);

      // If this is the first message (empty content), return the greeting
      if (!content.trim()) {
        return {
          message: {
            id: Date.now().toString(),
            content: this.generateGreeting(pet),
            role: 'assistant',
            timestamp: Date.now(),
          }
        };
      }

      // Send the user's message and get response
      const result = await chat.sendMessage(content);
      const response = await result.response;

      return {
        message: {
          id: Date.now().toString(),
          content: response.text(),
          role: 'assistant',
          timestamp: Date.now(),
        }
      };
    } catch (error) {
      console.error('Detailed error:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      if (error.status === 429) {
        throw new HttpException(
          'AI service is currently busy. Please try again in a few moments.',
          HttpStatus.TOO_MANY_REQUESTS
        );
      }

      throw new HttpException(
        'Failed to process message',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 