'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
}

export function Tooltip({ content, children, side = 'top', align = 'center' }: TooltipProps) {
  const [show, setShow] = React.useState(false);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (show && tooltipRef.current && containerRef.current) {
      const tooltip = tooltipRef.current;
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      // Position the tooltip above the container
      tooltip.style.bottom = `${container.offsetHeight + 8}px`; // 8px gap
      
      // Center the tooltip horizontally
      const leftOffset = (containerRect.width - tooltipRect.width) / 2;
      tooltip.style.left = `${leftOffset}px`;
    }
  }, [show]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          ref={tooltipRef}
          className={cn(
            'absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-sm whitespace-nowrap',
            'animate-in fade-in-0 zoom-in-95'
          )}
        >
          {content}
          <div className="absolute left-1/2 bottom-0 -mb-1 -ml-1 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
} 