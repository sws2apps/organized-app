import { atom } from 'recoil';

export const isPrecachedCPEState = atom({
  key: 'isPrecachedCPE',
  default: false,
});

export const showReloadCPEState = atom({
  key: 'showReloadCPE',
  default: false,
});

export const appSnackOpenCPEState = atom({
  key: 'appSnackOpenCPE',
  default: false,
});

export const appSeverityCPEState = atom({
  key: 'appSeverityCPE',
  default: 'success',
});

export const appMessageCPEState = atom({
  key: 'appMessageCPE',
  default: '',
});

export const isEmailAuthCPEState = atom({
  key: 'isEmailAuthCPE',
  default: false,
});

export const isAuthProcessingCPEState = atom({
  key: 'isAuthProcessingCPE',
  default: false,
});

export const migrationStepState = atom({
  key: 'migrationStep',
  default: 0,
});

export const apiHostCPEState = atom({
  key: 'apiHostCPE',
  default: '',
});

export const isMfaVerifyCPEState = atom({
  key: 'isMfaVerifyCPE',
  default: false,
});

export const tokenDevCPEState = atom({
  key: 'tokenDevCPE',
  default: undefined,
});

export const currentProviderCPEState = atom({
  key: 'currentProviderCPE',
  default: undefined,
});

export const congIDCPEState = atom({
  key: 'congIDCPE',
  default: '',
});
