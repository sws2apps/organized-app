import { ReactElement } from 'react';
import { PreachingPartnerRequestType } from '@definition/preaching_partner';

export type PreachingPartnerRowProps = {
  request: PreachingPartnerRequestType;
  variant: 'accent' | 'orange';
  actionLabel: string;
  actionIcon: ReactElement;
  onAction: VoidFunction;
};
