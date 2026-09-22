import { PreachingPartnerRequestType } from '@definition/preaching_partner';

export type PreachingPartnerRowProps = {
  request: PreachingPartnerRequestType;
  // the row picks its own action from who owns the request and who joined it
  onEdit?: (request: PreachingPartnerRequestType) => void;
  onJoin?: (request: PreachingPartnerRequestType) => void;
  onCancel?: (request: PreachingPartnerRequestType) => void;
};
