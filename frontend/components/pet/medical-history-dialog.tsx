'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pet, MedicalRecord } from '@/types/pet';
import { format } from 'date-fns';
import { Stethoscope, Thermometer, Syringe } from 'lucide-react';

interface MedicalHistoryDialogProps {
  pet: Pet;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MedicalHistoryDialog({ pet, open, onOpenChange }: MedicalHistoryDialogProps) {
  const sortedRecords = [...(pet.medicalHistory || [])].sort((a, b) => b.date - a.date);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Medical History - {pet.name}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          {sortedRecords.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No medical records yet.
            </p>
          ) : (
            sortedRecords.map((record) => (
              <div
                key={record.id}
                className="border rounded-lg overflow-hidden"
              >
                <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
                  <span className="font-medium">
                    {format(record.date, 'MMMM d, yyyy')}
                  </span>
                </div>
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-orange-600">
                      <Thermometer className="h-4 w-4" />
                      <span className="font-medium">Symptoms</span>
                    </div>
                    <p className="text-sm text-gray-600 bg-orange-50 p-3 rounded">
                      {record.symptoms}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Stethoscope className="h-4 w-4" />
                      <span className="font-medium">Diagnosis</span>
                    </div>
                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                      {record.diagnosis}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-600">
                      <Syringe className="h-4 w-4" />
                      <span className="font-medium">Treatment</span>
                    </div>
                    <p className="text-sm text-gray-600 bg-green-50 p-3 rounded">
                      {record.treatment}
                    </p>
                  </div>
                  {record.notes && (
                    <div className="mt-4 text-sm text-gray-500 bg-gray-50 p-3 rounded border">
                      <span className="font-medium">Additional Notes:</span>
                      <p className="mt-1">{record.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 