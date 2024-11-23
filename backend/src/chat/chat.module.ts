import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { PetModule } from '../pet/pet.module';

@Module({
  imports: [FirebaseModule, PetModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {} 