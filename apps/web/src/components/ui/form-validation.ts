import { useState } from 'react';

interface ZodError {
  errors: Array<{
    path: (string | number)[];
    message: string;
  }>;
}

interface ZodSchema<T> {
  parse(value: unknown): T;
  pick<K extends keyof T>(fields: Record<K, true>): ZodSchema<Pick<T, K>>;
}

interface UseFormValidationReturn<T> {
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  validateField: (field: keyof T, value: unknown) => void;
  touchField: (field: keyof T) => void;
  validateAll: () => boolean;
  hasErrors: boolean;
  getFieldError: (field: keyof T) => string | undefined;
}

export function useFormValidation<T extends Record<string, unknown>>(
  schema: ZodSchema<T>,
  values: T,
): UseFormValidationReturn<T> {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: keyof T, value: unknown) => {
    try {
      schema.pick({ [field]: true } as Record<keyof T, true>).parse({ [field]: value });
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    } catch (error) {
      const zodError = error as ZodError;
      if (zodError.errors?.[0]?.message) {
        setErrors(prev => ({ ...prev, [field as string]: zodError.errors[0]!.message }));
      }
    }
  };

  const touchField = (field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateAll = () => {
    try {
      schema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      const zodError = error as ZodError;
      const fieldErrors: Record<string, string> = {};
      zodError.errors?.forEach(err => {
        if (err.path?.[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
  };

  return {
    errors,
    touched,
    validateField,
    touchField,
    validateAll,
    hasErrors: Object.keys(errors).some(key => errors[key]),
    getFieldError: (field: keyof T) =>
      touched[field as string] ? errors[field as string] : undefined,
  };
}
