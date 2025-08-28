import { ReactNode, useState } from 'react';

export interface TooltipState {
  content: ReactNode;
  x: number;
  y: number;
}

export function useTooltip() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const handleMouseEnter = (e: React.MouseEvent, content: ReactNode) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltip({ content, x: rect.left + rect.width / 2, y: rect.top });
  };

  const handleMouseMove = (e: React.MouseEvent, content?: ReactNode) => {
    if (!tooltip) return;
    setTooltip((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null));
  };

  const handleMouseLeave = () => setTooltip(null);

  // Mobile / touch
  const handleTouchStart = (e: React.TouchEvent, content: ReactNode) => {
    const touch = e.touches[0];
    setTooltip({ content, x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTooltip((prev) => (prev ? { ...prev, x: touch.clientX, y: touch.clientY } : null));
  };

  const handleTouchEnd = () => setTooltip(null);

  return {
    tooltip,
    setTooltip,
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
