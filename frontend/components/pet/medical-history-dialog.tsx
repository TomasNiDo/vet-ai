'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Pet, MedicalRecord } from '@/types/pet';
import { format } from 'date-fns';
import { Stethoscope, Thermometer, Syringe, PencilIcon } from 'lucide-react';
import { EditMedicalRecordDialog } from './edit-medical-record-dialog';
import { Tooltip } from '@/components/ui/tooltip';

interface MedicalHistoryDialogProps {
  pet: Pet;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MedicalHistoryDialog({ pet, open, onOpenChange }: MedicalHistoryDialogProps) {
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const sortedRecords = [...(pet.medicalHistory || [])].sort((a, b) => b.date - a.date);

  const handleEdit = (record: MedicalRecord) => {
    setEditingRecord(record);
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Medical History - {pet.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            {sortedRecords.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No medical records yet.
              </p>
            ) : (
              sortedRecords.map((record) => (
                <div
                  key={record.id}
                  className="border rounded-lg overflow-hidden bg-card"
                >
                  <div className="bg-secondary/10 px-4 py-2 border-b flex justify-between items-center">
                    <span className="font-medium text-foreground">
                      {format(record.date, 'MMMM d, yyyy')}
                    </span>
                    <Tooltip content="Edit Record">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(record)}
                        className="h-8 w-8 hover:bg-secondary/20"
                      >
                        <PencilIcon className="h-4 w-4 text-secondary" />
                      </Button>
                    </Tooltip>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-secondary">
                        <Thermometer className="h-4 w-4" />
                        <span className="font-medium">Symptoms</span>
                      </div>
                      <p className="text-sm text-foreground bg-secondary/5 p-3 rounded">
                        {record.symptoms}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-accent">
                        <Stethoscope className="h-4 w-4" />
                        <span className="font-medium">Diagnosis</span>
                      </div>
                      <p className="text-sm text-foreground bg-accent/5 p-3 rounded">
                        {record.diagnosis}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-primary">
                        <Syringe className="h-4 w-4" />
                        <span className="font-medium">Treatment</span>
                      </div>
                      <p className="text-sm text-foreground bg-primary/5 p-3 rounded">
                        {record.treatment}
                      </p>
                    </div>
                    {record.notes && (
                      <div className="mt-4 text-sm text-muted-foreground bg-muted p-3 rounded border">
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

      {editingRecord && (
        <EditMedicalRecordDialog
          pet={pet}
          record={editingRecord}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onUpdate={() => {
            setIsEditDialogOpen(false);
            setEditingRecord(null);
            window.location.reload();
          }}
        />
      )}
    </>
  );
} 