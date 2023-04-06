import { cva, VariantProps } from 'class-variance-authority';
import { DetailedHTMLProps, forwardRef, HTMLAttributes } from 'react';

const styles = cva('font-medium rounded-full', {
  variants: {
    variant: {
      'primary-indigo':
        'bg-indigo-500 text-white shadow-md shadow-indigo-600/30  border-transparent border',
      'secondary-indigo':
        'bg-indigo-50 text-indigo-500  border-transparent border',
      'ghost-indigo': 'text-indigo-500 border border-indigo-200',
      'primary-amber':
        'bg-amber-500 text-white shadow-md shadow-indigo-950/10  border-transparent border',
      'secondary-amber':
        'bg-amber-50 text-amber-500  border-transparent border',
      'ghost-amber': 'text-amber-500 border border-amber-200',
    },
    disabled: {
      true: 'disabled:opacity-75',
    },
    size: {
      sm: 'p-2 w-20',
      md: 'p-2.5 w-24',
      lg: 'p-3 w-32',
      xl: 'p-3 w-40',
      full: 'p-3.5 w-full',
    },
  },
  defaultVariants: {
    variant: 'primary-indigo',
    disabled: false,
    size: 'md',
  },
});

type Props = VariantProps<typeof styles> &
  DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ size, variant, disabled, className, ...rest }, ref) => {
    return (
      <button
        {...rest}
        className={styles({
          size,
          variant,
          disabled,
          className: `rounded-lg tracking-widest text-xs active:scale-95 transition-transform duration-200 ${
            className || ''
          }`,
        })}
        disabled={disabled !== null ? disabled : false}
        ref={ref}
      />
    );
  }
);

Button.displayName = 'Button';
