'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
  onRate?: (rating: number) => void;
  isEditable?: boolean;
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = 16,
  className,
  onRate,
  isEditable = false,
}: RatingStarsProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            className={cn(
              'transition-colors',
              isEditable && 'cursor-pointer'
            )}
            size={size}
            fill={starValue <= rating ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
            strokeWidth={1}
            onClick={() => isEditable && onRate?.(starValue)}
          />
        );
      })}
    </div>
  );
}
