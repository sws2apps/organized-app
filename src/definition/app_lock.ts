export type AppLockSettingsType = {
  enabled: boolean;
  lock_after_minutes: number;
  biometric_enabled: boolean;
  pin_create_pending: boolean;
  failed_attempts: number;
  locked_until?: number;
  pin_hash?: string;
  pin_salt?: string;
  pin_iterations?: number;
  webauthn_credential_id?: string;
};

export type AppLockView = 'unlock' | 'forgot';
