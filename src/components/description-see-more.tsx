'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DescriptionWithSeeMoreProps {
  text: string;
  className?: string;
  truncateLength?: number;
}

export function DescriptionWithSeeMore({ text, className, truncateLength = 250 }: DescriptionWithSeeMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text || text.length <= truncateLength) {
    return <p className={cn('text-lg text-foreground/80 leading-relaxed', className)}>{text || ''}</p>;
  }

  return (
    <div className={className}>
      <p className={'text-lg text-foreground/80 leading-relaxed'}>
        {isExpanded ? text : `${text.substring(0, truncateLength)}...`}
      </p>
      <Button variant="link" onClick={() => setIsExpanded(!isExpanded)} className="p-0 h-auto text-primary hover:text-primary/80 mt-1 font-medium">
        {isExpanded ? 'Show less' : 'Show more'}
      </Button>
    </div>
  );
}
