import { PropsWithChildren } from 'react';

export type FeatureFlagProps = PropsWithChildren & {
  flag: string;
};
