import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../firebase/guards/firebase-auth.guard';
import { ChatService } from './chat.service';
import { ChatMessage } from './dto/chat.dto';

@Controller('chat')
@UseGuards(FirebaseAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendMessage(@Body() { message }: ChatMessage) {
    return this.chatService.handleMessage(message);
  }
} 