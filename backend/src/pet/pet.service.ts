import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Pet, CreatePetDto, UpdatePetDto, AddMedicalRecordDto } from './dto/pet.dto';

@Injectable()
export class PetService {
  constructor(private firebaseService: FirebaseService) {}

  private get petsRef() {
    return this.firebaseService.getDatabase().ref('pets');
  }

  async listPets(ownerId: string): Promise<Pet[]> {
    try {
      console.log('Listing pets for owner:', ownerId);

      const snapshot = await this.petsRef
        .orderByChild('ownerId')
        .equalTo(ownerId)
        .once('value');

      if (!snapshot.exists()) {
        return [];
      }

      const pets: Pet[] = [];
      snapshot.forEach((childSnapshot) => {
        pets.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
        return false; // Continue iteration
      });

      return pets.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error('Error listing pets:', error);
      throw new InternalServerErrorException('Failed to list pets');
    }
  }

  async getPet(petId: string, ownerId: string): Promise<Pet | null> {
    try {
      const snapshot = await this.petsRef.child(petId).once('value');
      
      if (!snapshot.exists()) {
        throw new NotFoundException('Pet not found');
      }

      const pet = { id: snapshot.key, ...snapshot.val() } as Pet;
      if (pet.ownerId !== ownerId) {
        throw new NotFoundException('Pet not found');
      }

      return pet;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get pet');
    }
  }

  async addMedicalRecord(petId: string, ownerId: string, dto: AddMedicalRecordDto) {
    try {
      const pet = await this.getPet(petId, ownerId);
      if (!pet) {
        throw new NotFoundException('Pet not found');
      }

      const record = {
        id: Date.now().toString(),
        ...dto,
        createdAt: Date.now(),
      };

      const medicalHistory = [...(pet.medicalHistory || []), record];

      await this.petsRef.child(petId).update({
        medicalHistory,
        updatedAt: Date.now(),
      });

      return record;
    } catch (error) {
      console.error('Error adding medical record:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to add medical record');
    }
  }

  async createPet(ownerId: string, dto: CreatePetDto): Promise<Pet> {
    try {
      const now = Date.now();
      const newPetRef = this.petsRef.push();
      
      const pet: Pet = {
        id: newPetRef.key,
        ...dto,
        ownerId,
        medicalHistory: [],
        createdAt: now,
        updatedAt: now,
      };

      await newPetRef.set(pet);
      return pet;
    } catch (error) {
      console.error('Error creating pet:', error);
      throw new InternalServerErrorException('Failed to create pet');
    }
  }

  async updatePet(petId: string, ownerId: string, dto: UpdatePetDto): Promise<Pet> {
    try {
      const pet = await this.getPet(petId, ownerId);
      if (!pet) {
        throw new NotFoundException('Pet not found');
      }

      const updates = {
        ...dto,
        updatedAt: Date.now(),
      };

      await this.petsRef.child(petId).update(updates);
      return { ...pet, ...updates };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update pet');
    }
  }

  async deletePet(petId: string, ownerId: string): Promise<void> {
    try {
      const pet = await this.getPet(petId, ownerId);
      if (!pet) {
        throw new NotFoundException('Pet not found');
      }

      await this.petsRef.child(petId).remove();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete pet');
    }
  }
} 