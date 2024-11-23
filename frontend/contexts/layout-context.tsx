'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface LayoutContextType {
  isNavbarFixed: boolean;
  setIsNavbarFixed: (fixed: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isNavbarFixed, setIsNavbarFixed] = React.useState(pathname === '/');

  React.useEffect(() => {
    setIsNavbarFixed(pathname === '/');
  }, [pathname]);

  return (
    <LayoutContext.Provider value={{ isNavbarFixed, setIsNavbarFixed }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
} 