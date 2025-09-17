import { cn } from '@/lib/utils';
import { BotMessageSquare } from 'lucide-react';
import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center justify-center">
        <BotMessageSquare className="h-6 w-6 text-primary" />
    </div>
  );
}
