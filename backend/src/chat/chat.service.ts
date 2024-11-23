import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatResponse } from './dto/chat.dto';
import { Pet } from '../pet/dto/pet.dto';

@Injectable()
export class ChatService implements OnModuleInit {
  private gemini;
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    this.apiKey = apiKey;
  }

  onModuleInit() {
    const genAI = new GoogleGenerativeAI(this.apiKey);
    this.gemini = genAI.getGenerativeModel({
      model: this.configService.get<string>('GEMINI_AI_MODEL') || 'gemini-pro',
    });
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
      Context about the pet:
      Name: ${pet.name}
      Species: ${pet.species}
      Breed: ${pet.breed || 'Not specified'}
      Age: ${pet.age} years
      Weight: ${pet.weight} kg

      Medical History:
      ${medicalHistory || 'No medical history available'}

      Please consider this information when providing advice. Keep responses focused on this specific pet's characteristics and history.
    `;
  }

  async startNewChat(pet: Pet) {
    const petContext = this.generatePetContext(pet);
    const chat = this.gemini.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'Please confirm you understand the following context about the pet I am asking about.' }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. Please provide the pet\'s information.' }],
        },
        {
          role: 'user',
          parts: [{ text: petContext }],
        },
        {
          role: 'model',
          parts: [{ text: `I understand the context about ${pet.name}. I'll consider their species, breed, age, weight, and medical history when providing advice. How can I help you with ${pet.name} today?` }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    return chat;
  }

  async handleMessage(content: string, pet?: Pet): Promise<{ message: ChatResponse }> {
    const startTime = Date.now();
    try {
      // Create a new chat session with pet context if provided
      const chat = pet ? await this.startNewChat(pet) : this.gemini.startChat();
      
      // Send message and get response
      const result = await chat.sendMessage(content);
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
      throw error;
    }
  }
} 