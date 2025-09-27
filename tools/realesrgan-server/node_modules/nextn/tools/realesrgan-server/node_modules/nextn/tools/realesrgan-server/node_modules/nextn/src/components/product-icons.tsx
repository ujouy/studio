import { cn } from '@/lib/utils';
import * as React from 'react';

export const IconTshirt = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
      {...props}
    >
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    </svg>
  )
);
IconTshirt.displayName = 'IconTshirt';

export const IconHoodie = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
      {...props}
    >
      <path d="M3 12h2.5" />
      <path d="M18.5 12H21" />
      <path d="M12 12h.01" />
      <path d="M12 7.1a5 5 0 0 1 5 5" />
      <path d="M12 7.1a5 5 0 0 0-5 5" />
      <path d="M12 21a5 5 0 0 0 5-5" />
      <path d="M12 21a5 5 0 0 1-5-5" />
      <path d="M7 21a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5V20a1 1 0 0 0 1 1" />
      <path d="M7.8 14.5a2.5 2.5 0 0 0-2.8 2.5" />
      <path d="M19 17a2.5 2.5 0 0 0-2.8-2.5" />
      <path d="m3.5 10.5-.6 2.5" />
      <path d="m20.5 10.5.6 2.5" />
      <path d="M12 2v3.1" />
    </svg>
  )
);
IconHoodie.displayName = 'IconHoodie';

export const IconCap = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
      {...props}
    >
      <path d="M12 2a5.5 5.5 0 0 0-5.5 5.5c0 1.62.74 3.09 1.88 4.09" />
      <path d="M12 12a5.5 5.5 0 0 1 5.5-5.5c0 1.62-.74 3.09-1.88 4.09" />
      <path d="M20 12h-4a8 8 0 0 0-8 8v1" />
      <path d="M4 12h4a8 8 0 0 1 8 8v1" />
    </svg>
  )
);
IconCap.displayName = 'IconCap';
