import { Pet } from '@/types/pet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { PencilIcon, TrashIcon, PawPrint, Weight, Cake, PlusCircle, ClipboardList, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { EditPetDialog } from './edit-pet-dialog'
import { DeletePetDialog } from './delete-pet-dialog'
import { AddMedicalRecordDialog } from './add-medical-record-dialog'
import { MedicalHistoryDialog } from './medical-history-dialog'
import { useRouter } from 'next/navigation';
import { Tooltip } from '@/components/ui/tooltip';

interface PetCardProps {
  pet: Pet
  onUpdate: () => void
}

export function PetCard({ pet, onUpdate }: PetCardProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isAddMedicalRecordOpen, setIsAddMedicalRecordOpen] = useState(false)
  const [isMedicalHistoryOpen, setIsMedicalHistoryOpen] = useState(false)

  const getInitials = (name: string) => name.slice(0, 2).toUpperCase()
  const getAvatarUrl = (species: string) => `/images/${species.toLowerCase()}.png`

  const handleStartChat = () => {
    router.push(`/chat?petId=${pet.id}`);
  };

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-100 to-purple-100">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 border-2 border-white">
              <AvatarFallback>{getInitials(pet.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl font-bold">{pet.name}</CardTitle>
              <Badge variant="secondary" className="mt-1">
                {pet.species}
              </Badge>
            </div>
          </div>
          <div className="flex -space-x-1">
            <Tooltip content="Start Chat About This Pet">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleStartChat}
                className="hover:bg-green-200"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </Tooltip>

            <Tooltip content="View Medical History">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMedicalHistoryOpen(true)}
                className="hover:bg-blue-200"
              >
                <ClipboardList className="h-4 w-4" />
              </Button>
            </Tooltip>

            <Tooltip content="Add Medical Record">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAddMedicalRecordOpen(true)}
                className="hover:bg-green-200"
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </Tooltip>

            <Tooltip content="Edit Pet">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditOpen(true)}
                className="hover:bg-blue-200"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </Tooltip>

            <Tooltip content="Delete Pet">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDeleteOpen(true)}
                className="hover:bg-red-200"
              >
                <TrashIcon className="h-4 w-4 text-destructive" />
              </Button>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <PawPrint className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {pet.breed || pet.species}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Cake className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{pet.age} years old</span>
            </div>
            <div className="flex items-center space-x-2">
              <Weight className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{pet.weight} kg</span>
            </div>
            <div className="flex items-center space-x-2">
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {pet.medicalHistory ? pet.medicalHistory.length : 0} medical records
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditPetDialog
        pet={pet}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onUpdate={onUpdate}
      />

      <DeletePetDialog
        pet={pet}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onDelete={onUpdate}
      />

      <AddMedicalRecordDialog
        pet={pet}
        open={isAddMedicalRecordOpen}
        onOpenChange={setIsAddMedicalRecordOpen}
        onAdd={onUpdate}
      />

      <MedicalHistoryDialog
        pet={pet}
        open={isMedicalHistoryOpen}
        onOpenChange={setIsMedicalHistoryOpen}
      />
    </>
  );
}

