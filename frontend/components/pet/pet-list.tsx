'use client';

import { useState, useEffect } from 'react';
import { Pet } from '@/types/pet';
import { PetCard } from './pet-card';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { AddPetDialog } from './add-pet-dialog';
import axios from '@/lib/axios';

export function PetList() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const fetchPets = async () => {
    try {
      const { data } = await axios.get('/api/pets');
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

  const handleAddPet = (newPet: Pet) => {
    setPets((prev) => [...prev, newPet]);
  };

  const handleUpdatePet = () => {
    fetchPets();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Pets</h1>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Pet
        </Button>
      </div>

      {pets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You haven&apos;t added any pets yet.</p>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Your First Pet
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} onUpdate={handleUpdatePet} />
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