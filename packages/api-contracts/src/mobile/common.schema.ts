import { z } from 'zod';

// ---------------------------------------------------------------------------
// API Response Envelope
// All mobile endpoints return this shape for consistent client handling.
// ---------------------------------------------------------------------------

export const ApiSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    ok: z.literal(true),
    data: dataSchema,
  });

export const ApiErrorSchema = z.object({
  ok: z.literal(false),
  error: z.object({
    /** Machine-readable error code, e.g. "INVALID_CREDENTIALS" */
    code: z.string(),
    /** Human-readable message */
    message: z.string(),
    /** Optional correlation id for server-side log tracing */
    requestId: z.string().optional(),
  }),
});

export type ApiSuccess<T> = { ok: true; data: T };
export type ApiError = z.infer<typeof ApiErrorSchema>;
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/**
 * Constructs a successful API response object.
 *
 * @param data - The response payload
 * @returns Typed success envelope
 */
export function ok<T>(data: T): ApiSuccess<T> {
  return { ok: true, data };
}

/**
 * Constructs a failed API response object.
 *
 * @param code - Machine-readable error code
 * @param message - Human-readable error description
 * @param requestId - Optional tracing id
 * @returns Typed error envelope
 */
export function err(code: string, message: string, requestId?: string): ApiError {
  return { ok: false, error: { code, message, requestId } };
}
