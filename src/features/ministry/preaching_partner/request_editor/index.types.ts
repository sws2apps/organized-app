import { PreachingPartnerRequestType } from '@definition/preaching_partner';

export type PreachingPartnerEditorProps = {
  open: boolean;
  onClose: VoidFunction;
  onSaved?: VoidFunction;
  // an absent request opens the editor on a new one
  request?: PreachingPartnerRequestType;
};
