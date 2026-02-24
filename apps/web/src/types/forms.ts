import { z } from 'zod';

export interface FormValidationErrors {
  [key: string]: string | undefined;
}

export interface FormTouchedFields {
  [key: string]: boolean;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormValidationErrors;
}

export interface FormFieldConfig {
  label: string;
  error?: string;
  success?: string;
  hint?: string;
  required?: boolean;
  className?: string;
}

export interface FormSectionConfig {
  title: string;
  description?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  className?: string;
}

export interface FormProgressConfig {
  steps: string[];
  currentStep: number;
  className?: string;
}

export interface ValidationSummaryConfig {
  errors: string[];
  className?: string;
}

export interface CharacterCounterConfig {
  value: string;
  maxLength: number;
  className?: string;
}

export type ZodSchema = z.ZodSchema<Record<string, unknown>>;

export interface UseFormValidationConfig<T extends Record<string, unknown>> {
  schema: z.ZodSchema<T>;
  values: T;
}

export interface UseFormValidationReturn {
  errors: FormValidationErrors;
  touched: FormTouchedFields;
  validateField: (field: string, value: unknown) => void;
  touchField: (field: string) => void;
  validateAll: () => boolean;
}
