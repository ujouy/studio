import { cn } from '@/lib/utils';
import * as React from 'react';

const Logo = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn('size-6', className)}
        {...props}
      >
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
        <path d="M2 7l10 5" />
        <path d="M12 12v10" />
        <path d="M22 7l-10 5" />
        <path d="M7.5 9.5L12 12l4.5-2.5" />
      </svg>
    );
  }
);

Logo.displayName = 'Logo';
export default Logo;
