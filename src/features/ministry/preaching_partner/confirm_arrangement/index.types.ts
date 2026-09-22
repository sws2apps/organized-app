import { PreachingPartnerRequestType } from '@definition/preaching_partner';

export type PreachingPartnerConfirmProps = {
  open: boolean;
  onClose: VoidFunction;
  request: PreachingPartnerRequestType;
};
