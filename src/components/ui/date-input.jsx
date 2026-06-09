import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

/**
 * Responsive date field that stays within the screen width on mobile Safari.
 */
const DateInput = React.forwardRef(({ className, wrapperClassName, onChange, onInput, ...props }, ref) => {
  const handleChange = (event) => {
    onChange?.(event);
    onInput?.(event);
  };

  return (
    <div className={cn('w-full min-w-0 max-w-full', wrapperClassName)}>
      <Input
        ref={ref}
        type="date"
        className={cn(
          'app-date-input box-border !block h-12 w-full min-w-0 max-w-full font-mono',
          'text-[clamp(0.8125rem,3.2vw,0.875rem)]',
          className
        )}
        onChange={handleChange}
        onInput={handleChange}
        {...props}
      />
    </div>
  );
});
DateInput.displayName = 'DateInput';

export { DateInput };
