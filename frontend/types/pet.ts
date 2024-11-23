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
  type: 'symptom' | 'diagnosis' | 'treatment';
  description: string;
  notes?: string;
  createdAt: number;
} 