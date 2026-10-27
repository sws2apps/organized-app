import { PartnerSyncLocal } from '@definition/preaching_partner';
export type AppLocalType = {
  id: number;
  avatar?: ArrayBuffer;
  partnerSync?: PartnerSyncLocal;
  partnerNotificationsRead?: string[];
};
