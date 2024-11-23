'use client';

import React, { useState, useRef, useEffect } from 'react';

interface SelectProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  children: React.ReactNode;
  placeholder?: string;
  displayValue?: string;
}

export interface SelectTriggerProps {
  children: React.ReactNode;
}

export interface SelectContentProps {
  children: React.ReactNode;
}

export interface SelectValueProps {
  children?: React.ReactNode;
}

export function Select<T extends string>({ 
  value, 
  onValueChange, 
  children, 
  placeholder,
  displayValue,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <SelectTrigger onClick={() => setOpen(!open)}>
        <SelectValue>{displayValue || value || placeholder || 'Select option...'}</SelectValue>
      </SelectTrigger>
      {open && (
        <SelectContent>
          {React.Children.map(children, (child) => {
            if (React.isValidElement<SelectItemProps<T>>(child)) {
              return React.cloneElement(child, {
                ...child.props,
                onSelect: (value: T) => {
                  onValueChange(value);
                  setOpen(false);
                },
              });
            }
            return child;
          })}
        </SelectContent>
      )}
    </div>
  );
}

interface SelectItemProps<T extends string> {
  value: T;
  children: React.ReactNode;
  onSelect?: (value: T) => void;
}

export function SelectItem<T extends string>({ value, children, onSelect }: SelectItemProps<T>) {
  return (
    <div
      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => onSelect?.(value)}
    >
      {children}
    </div>
  );
}

export function SelectTrigger({ children, onClick }: SelectTriggerProps & { onClick?: () => void }) {
  return (
    <div
      className="flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm cursor-pointer"
      onClick={onClick}
    >
      {children}
      <span className="ml-2">▼</span>
    </div>
  );
}

export function SelectContent({ children }: SelectContentProps) {
  return (
    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
      {children}
    </div>
  );
}

export function SelectValue({ children }: SelectValueProps) {
  return <span>{children}</span>;
} 