'use client';

import { PetList } from '@/components/pet/pet-list';
import { AuthWrapper } from '@/components/auth/auth-wrapper';

function PetsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <PetList />
    </div>
  );
}

export default function ProtectedPetsPage() {
  return (
    <AuthWrapper>
      <PetsPage />
    </AuthWrapper>
  );
} 