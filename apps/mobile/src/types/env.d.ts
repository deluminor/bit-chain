/**
 * Ambient type declarations for Expo environment variables.
 * Metro replaces `process.env.EXPO_PUBLIC_*` at build time.
 * @see https://docs.expo.dev/guides/environment-variables/
 */
declare const process: {
  env: {
    /** Public API base URL — set in .env.local as EXPO_PUBLIC_API_URL */
    readonly EXPO_PUBLIC_API_URL: string | undefined;
    readonly NODE_ENV: 'development' | 'test' | 'production';
  };
};
