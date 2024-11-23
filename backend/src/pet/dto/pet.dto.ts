export interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed?: string;
  age: number;
  weight: number;
  medicalHistory: MedicalRecord[];
  ownerId: string;
  createdAt: number;
  updatedAt: number;
}

export interface MedicalRecord {
  id: string;
  date: number;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  createdAt: number;
}

export class CreatePetDto {
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed?: string;
  age: number;
  weight: number;
}

export class UpdatePetDto {
  name?: string;
  age?: number;
  weight?: number;
  breed?: string;
}

export class AddMedicalRecordDto {
  symptoms: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  date: number;
} 