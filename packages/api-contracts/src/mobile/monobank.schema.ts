import { z } from 'zod';

// ---------------------------------------------------------------------------
// Mobile Monobank Integration schemas
// Used by:
//   GET   /api/mobile/integrations/monobank         — status
//   POST  /api/mobile/integrations/monobank/connect — connect
//   PATCH /api/mobile/integrations/monobank/accounts — toggle import
//   POST  /api/mobile/integrations/monobank/sync    — trigger sync
// ---------------------------------------------------------------------------

/** Monobank integration connection status */
export const IntegrationStatusEnum = z.enum(['CONNECTED', 'DISCONNECTED', 'ERROR']);
export type IntegrationStatus = z.infer<typeof IntegrationStatusEnum>;

/** Account owner type */
export const AccountOwnerEnum = z.enum(['PERSONAL', 'FOP']);
export type AccountOwner = z.infer<typeof AccountOwnerEnum>;

/** A single Monobank linked account */
export const MonobankAccountSchema = z.object({
  id: z.string(),
  externalId: z.string(),
  name: z.string(),
  type: z.string(),
  currency: z.string(),
  balance: z.number(),
  creditLimit: z.number(),
  importEnabled: z.boolean(),
  owner: AccountOwnerEnum,
  maskedPan: z.array(z.string()),
  financeAccountId: z.string().nullable(),
});

export type MonobankAccount = z.infer<typeof MonobankAccountSchema>;

/** GET /api/mobile/integrations/monobank — response data */
export const MonobankStatusResponseSchema = z.object({
  status: IntegrationStatusEnum,
  connectedAt: z.string().datetime().nullable(),
  lastSyncAt: z.string().datetime().nullable(),
  /** Token is present — client shows "connected", otherwise "connect" CTA */
  hasToken: z.boolean(),
  accounts: z.array(MonobankAccountSchema),
  summary: z.object({
    total: z.number().int().nonnegative(),
    enabled: z.number().int().nonnegative(),
  }),
});

export type MonobankStatusResponse = z.infer<typeof MonobankStatusResponseSchema>;

/** POST /api/mobile/integrations/monobank/connect — request body */
export const MonobankConnectRequestSchema = z.object({
  /**
   * Monobank personal API token.
   * If omitted, the server will use the stored token (re-connect flow).
   */
  token: z.string().optional(),
});

export type MonobankConnectRequest = z.infer<typeof MonobankConnectRequestSchema>;

/** POST /api/mobile/integrations/monobank/connect — response data */
export const MonobankConnectResponseSchema = z.object({
  connected: z.literal(true),
  accountsFound: z.number().int().nonnegative(),
  accounts: z.array(MonobankAccountSchema),
});

export type MonobankConnectResponse = z.infer<typeof MonobankConnectResponseSchema>;

/** Account toggle item in PATCH request */
export const AccountToggleItemSchema = z.object({
  accountId: z.string(),
  importEnabled: z.boolean(),
  name: z.string().min(1).max(100).optional(),
});

export type AccountToggleItem = z.infer<typeof AccountToggleItemSchema>;

/** PATCH /api/mobile/integrations/monobank/accounts — request body */
export const MonobankAccountsUpdateRequestSchema = z.object({
  accounts: z.array(AccountToggleItemSchema).min(1),
});

export type MonobankAccountsUpdateRequest = z.infer<typeof MonobankAccountsUpdateRequestSchema>;

/** PATCH /api/mobile/integrations/monobank/accounts — response data */
export const MonobankAccountsUpdateResponseSchema = z.object({
  updated: z.number().int().nonnegative(),
  accounts: z.array(MonobankAccountSchema),
});

export type MonobankAccountsUpdateResponse = z.infer<typeof MonobankAccountsUpdateResponseSchema>;

/** POST /api/mobile/integrations/monobank/sync — request body */
export const MonobankSyncRequestSchema = z.object({
  fromDate: z.string().datetime().optional(),
  force: z.boolean().optional().default(false),
});

export type MonobankSyncRequest = z.infer<typeof MonobankSyncRequestSchema>;
export type MonobankSyncRequestInput = z.input<typeof MonobankSyncRequestSchema>;

/** POST /api/mobile/integrations/monobank/sync — response data */
export const MonobankSyncResponseSchema = z.object({
  synced: z.boolean(),
  imported: z.number().int().nonnegative(),
  syncedAt: z.string().datetime(),
  message: z.string().optional(),
  remainingAccounts: z.number().int().nonnegative().optional(),
});

export type MonobankSyncResponse = z.infer<typeof MonobankSyncResponseSchema>;

export const RateLimitResponseSchema = z.object({
  rateLimited: z.literal(true),
  retryAfterSeconds: z.number().int().positive(),
  message: z.string(),
});

export type RateLimitResponse = z.infer<typeof RateLimitResponseSchema>;
