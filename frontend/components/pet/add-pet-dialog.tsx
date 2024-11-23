'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';
import { getAuth } from 'firebase/auth';
import { Pet } from '@/types/pet';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface AddPetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (pet: Pet) => void;
}

const initialFormData = {
  name: '',
  species: 'dog' as const,
  breed: '',
  age: '',
  weight: '',
};

export function AddPetDialog({ open, onOpenChange, onAdd }: AddPetDialogProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData(initialFormData);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = await getAuth().currentUser?.getIdToken();
      const response = await fetch(`${API_URL}/api/pets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age),
          weight: Number(formData.weight),
        }),
      });

      if (!response.ok) throw new Error('Failed to create pet');

      const pet = await response.json();
      onAdd(pet);
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating pet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Pet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Species</label>
            <Select
              value={formData.species}
              onValueChange={(value: 'dog' | 'cat' | 'other') =>
                setFormData({ ...formData, species: value })
              }
            >
              <SelectItem value="dog">Dog</SelectItem>
              <SelectItem value="cat">Cat</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Breed (optional)</label>
            <Input
              value={formData.breed}
              onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Age (years)</label>
              <Input
                required
                type="number"
                min="0"
                step="0.1"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Weight (kg)</label>
              <Input
                required
                type="number"
                min="0"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Pet'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 