'use client';

import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Eye, EyeOff, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

// Enhanced form field with validation states
interface FormFieldProps {
  label: string;
  error?: string;
  success?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  error,
  success,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2">
        <Label
          className={cn(
            'text-sm font-medium',
            error && 'text-red-600 dark:text-red-400',
            success && 'text-green-600 dark:text-green-400',
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {hint && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm max-w-xs">{hint}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="relative">
        {children}

        {/* Success icon */}
        {success && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>
        )}

        {/* Error icon */}
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}

      {/* Success message */}
      {success && !error && (
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-3 w-3" />
          {success}
        </div>
      )}
    </div>
  );
}

// Enhanced input with password toggle
interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        className={cn('pr-10', className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
}

// Form section with collapsible functionality
interface FormSectionProps {
  title: string;
  description?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  collapsible = false,
  defaultOpen = true,
  children,
  className,
}: FormSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className={cn('flex items-center justify-between', collapsible && 'cursor-pointer')}
        onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
      >
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {collapsible && (
          <Button variant="ghost" size="sm">
            {isOpen ? 'Collapse' : 'Expand'}
          </Button>
        )}
      </div>

      {isOpen && <div className="space-y-4 border-l-2 border-muted pl-4">{children}</div>}
    </div>
  );
}

// Form validation summary
interface ValidationSummaryProps {
  errors: string[];
  className?: string;
}

export function ValidationSummary({ errors, className }: ValidationSummaryProps) {
  if (errors.length === 0) return null;

  return (
    <div
      className={cn(
        'p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg',
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <span className="font-medium text-red-800 dark:text-red-200">
          Please fix the following errors:
        </span>
      </div>
      <ul className="list-disc list-inside space-y-1">
        {errors.map((error, index) => (
          <li key={index} className="text-sm text-red-700 dark:text-red-300">
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Progress indicator for multi-step forms
interface FormProgressProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function FormProgress({ steps, currentStep, className }: FormProgressProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>
          Step {currentStep + 1} of {steps.length}
        </span>
        <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
      </div>

      <div className="flex space-x-2">
        {steps.map((step, index) => (
          <div key={index} className="flex-1">
            <div
              className={cn(
                'h-2 rounded-full transition-colors',
                index <= currentStep ? 'bg-primary' : 'bg-muted',
              )}
            />
            <div className="mt-2 text-xs text-center">
              <span
                className={cn(
                  index <= currentStep ? 'text-primary font-medium' : 'text-muted-foreground',
                )}
              >
                {step}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { CharacterCounter, TextareaWithCounter } from './form-counter';
export { useFormValidation } from './form-validation';
