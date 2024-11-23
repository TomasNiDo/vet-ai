import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../firebase/guards/firebase-auth.guard';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/chat.dto';
import { PetService } from '../pet/pet.service';

@Controller('chat')
@UseGuards(FirebaseAuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly petService: PetService,
  ) {}

  @Post()
  async sendMessage(@Body() dto: SendMessageDto) {
    let pet;
    if (dto.petId) {
      pet = await this.petService.getPet(dto.petId, dto.ownerId);
    }
    return this.chatService.handleMessage(dto.message, pet);
  }
} 