'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getAuth } from 'firebase/auth';
import { Pet } from '@/types/pet';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface AddMedicalRecordDialogProps {
  pet: Pet;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: () => void;
}

export function AddMedicalRecordDialog({
  pet,
  open,
  onOpenChange,
  onAdd,
}: AddMedicalRecordDialogProps) {
  const [formData, setFormData] = useState({
    symptoms: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = await getAuth().currentUser?.getIdToken();
      const response = await fetch(`${API_URL}/api/pets/${pet.id}/medical-records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date).getTime(),
        }),
      });

      if (!response.ok) throw new Error('Failed to add medical record');

      onAdd();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding medical record:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Medical Record for {pet.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full rounded-md border border-input px-3 py-2"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Symptoms</label>
            <Textarea
              required
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
              placeholder="Describe the symptoms..."
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Diagnosis</label>
            <Textarea
              required
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              placeholder="Enter the diagnosis..."
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Treatment</label>
            <Textarea
              required
              value={formData.treatment}
              onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
              placeholder="Describe the treatment plan..."
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Additional Notes (optional)</label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes..."
            />
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
              {isLoading ? 'Adding...' : 'Add Record'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 