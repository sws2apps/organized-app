import { atom } from 'recoil';

export const appSnackOpenState = atom({
  key: 'appSnackOpen',
  default: false,
});

export const appSeverityState = atom({
  key: 'appSeverity',
  default: 'success',
});

export const appMessageState = atom({
  key: 'appMessage',
  default: '',
});
