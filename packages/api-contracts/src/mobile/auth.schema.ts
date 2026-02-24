import { z } from 'zod';

// ---------------------------------------------------------------------------
// Mobile Auth — Request / Response schemas
// Used by: POST /api/mobile/auth/login
//          POST /api/mobile/auth/refresh
//          GET  /api/mobile/auth/me
//          POST /api/mobile/auth/logout
// ---------------------------------------------------------------------------

/** POST /api/mobile/auth/login — request body */
export const LoginRequestSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .transform((v) => v.toLowerCase().trim()),
  password: z.string().min(1, 'Password is required'),
  /**
   * Optional device identifier for session tracking.
   * Client should generate a stable UUID per device install.
   */
  deviceId: z.string().uuid().optional(),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

/** Authenticated user minimal profile */
export const AuthUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
});

export type AuthUser = z.infer<typeof AuthUserSchema>;

/** Token pair returned on login and refresh */
export const TokenResponseSchema = z.object({
  /** Short-lived JWT for API requests. Lifetime: 15 minutes. */
  accessToken: z.string(),
  /** Long-lived opaque token for obtaining new access tokens. Lifetime: 30 days. */
  refreshToken: z.string(),
  /** Access token lifetime in seconds */
  expiresIn: z.number().int().positive(),
  user: AuthUserSchema,
});

export type TokenResponse = z.infer<typeof TokenResponseSchema>;

/** POST /api/mobile/auth/refresh — request body */
export const RefreshRequestSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RefreshRequest = z.infer<typeof RefreshRequestSchema>;

/** GET /api/mobile/auth/me — response data */
export const MeResponseSchema = AuthUserSchema;
export type MeResponse = z.infer<typeof MeResponseSchema>;
