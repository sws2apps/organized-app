import {
  PartnerWireMutation,
  PreachingPartnerRequestType,
} from '@definition/preaching_partner';
import { decryptObject, encryptObject } from '@services/encryption';
import { partnerRequestIsValid } from '@utils/preaching_partner';

const TABLE = 'preaching_partner_requests';

export const sealPartnerMutation = (
  mutation: PartnerWireMutation,
  accessCode: string
) => {
  const sealed = structuredClone(mutation);
  encryptObject({ data: sealed.request, table: TABLE, accessCode });
  return sealed;
};

// A record sealed with another key or tampered with is left out instead of breaking the list.
export const openPartnerRequests = (
  requests: PreachingPartnerRequestType[],
  accessCode: string
) =>
  requests.flatMap((record) => {
    try {
      const opened = structuredClone(record);
      decryptObject({ data: opened, table: TABLE, accessCode });
      return partnerRequestIsValid(opened, opened.request_data.date)
        ? [opened]
        : [];
    } catch {
      return [];
    }
  });
