import { PreachingPartnerRequestType } from '@definition/preaching_partner';
import { Table } from 'dexie';

export type PreachingPartnerRequestsTable = {
  preaching_partner_requests: Table<PreachingPartnerRequestType>;
};

export const preachingPartnerRequestsSchema = {
  preaching_partner_requests: '&request_uid, request_data',
};
