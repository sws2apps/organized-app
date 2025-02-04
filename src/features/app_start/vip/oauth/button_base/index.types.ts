import { ReactElement } from 'react';
import { AuthProvider } from 'firebase/auth';

export type OAuthButtonBaseProps = {
  logo: ReactElement;
  text: string;
  provider?: AuthProvider;
};

export type NextStepType = {
  createCongregation?: boolean;
  unauthorized?: boolean;
  encryption?: boolean;
  isVerifyMFA?: boolean;
};
