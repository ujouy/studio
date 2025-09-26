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
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        <path d="M16.5 9.4l-9 4.5" />
        <path d="M18.5 14.4l-5 2.5" />
        <path d="M5.5 14.4l5 2.5" />
      </svg>
    );
  }
);

Logo.displayName = 'Logo';
export default Logo;
