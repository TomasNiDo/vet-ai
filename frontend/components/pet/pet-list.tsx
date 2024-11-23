'use client';

import { useState, useEffect } from 'react';
import { Pet } from '@/types/pet';
import { getAuth } from 'firebase/auth';
import { PetCard } from './pet-card';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { AddPetDialog } from './add-pet-dialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function PetList() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const auth = getAuth();

  const fetchPets = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`${API_URL}/api/pets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch pets');
      
      const data = await response.json();
      setPets(data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleAddPet = async (newPet: Pet) => {
    setPets(prev => [newPet, ...prev]);
    setIsAddDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Pets</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Pet
        </Button>
      </div>

      {pets.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No pets added yet</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} onUpdate={fetchPets} />
          ))}
        </div>
      )}

      <AddPetDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddPet}
      />
    </div>
  );
} 