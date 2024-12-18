export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export class SendMessageDto {
  message: string;
  petId?: string;
  ownerId: string;
}

export interface ChatResponse {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}
