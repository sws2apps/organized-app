import {
  PartnerMutation,
  PreachingPartnerRequestType,
} from '@definition/preaching_partner';
import { partnerRequestIsValid } from '@utils/preaching_partner';

const editableData = (request: PreachingPartnerRequestType) => {
  const { date, flexible, start, end, type, comment } = request.request_data;
  return {
    date,
    flexible,
    start: flexible ? undefined : start,
    end: flexible ? undefined : end,
    type,
    comment: comment.trim(),
  };
};

const validateAction = (
  current: PreachingPartnerRequestType,
  action: PartnerMutation['action'],
  actor: string,
  activePersonIds: string[]
) => {
  const data = current.request_data;
  const isOwner = data.person_uid === actor;
  const isPartner = data.partner_uid === actor;
  if (!activePersonIds.includes(data.person_uid))
    throw new Error('tr_partnerRequestChanged');
  if (
    (action === 'edit' || action === 'delete') &&
    (!isOwner || data.partner_uid)
  )
    throw new Error('tr_partnerRequestChanged');
  if (action === 'cancel' && ((!isOwner && !isPartner) || !data.partner_uid))
    throw new Error('tr_partnerRequestChanged');
  if (
    action === 'join' &&
    (isOwner || data.partner_uid || !partnerRequestIsValid(current))
  )
    throw new Error('tr_partnerRequestChanged');
};

const withdrawnRequests = (
  records: PreachingPartnerRequestType[],
  ids: string[],
  actor: string,
  date: string,
  now: string
) =>
  records
    .filter(
      (own) =>
        ids.includes(own.request_uid) &&
        own.request_data.person_uid === actor &&
        !own.request_data._deleted &&
        !own.request_data.partner_uid &&
        own.request_data.date === date
    )
    .map((own) => ({
      ...own,
      request_data: { ...own.request_data, _deleted: true, updatedAt: now },
    }));

const createRequest = (
  request: PreachingPartnerRequestType,
  current: PreachingPartnerRequestType | undefined,
  actor: string,
  now: string
): PreachingPartnerRequestType[] => {
  if (
    current ||
    request.request_data.person_uid !== actor ||
    !partnerRequestIsValid(request)
  )
    throw new Error('tr_partnerInvalidRequest');
  return [
    {
      request_uid: request.request_uid,
      request_data: {
        ...editableData(request),
        person_uid: actor,
        _deleted: false,
        updatedAt: now,
      },
    },
  ];
};

// Pure transition rules are shared by the transactional writer and regression tests.
export const applyPartnerMutation = (
  records: PreachingPartnerRequestType[],
  mutation: PartnerMutation,
  actor: string,
  activePersonIds: string[],
  now = new Date().toISOString()
) => {
  const { action, request, withdrawRequestIds = [] } = mutation;
  if (!actor || !activePersonIds.includes(actor))
    throw new Error('tr_partnerIdentityRequired');
  const current = records.find(
    (record) => record.request_uid === request.request_uid
  );
  if (action === 'create') return createRequest(request, current, actor, now);
  if (
    !current ||
    current.request_data._deleted ||
    current.request_data.updatedAt !== request.request_data.updatedAt
  )
    throw new Error('tr_partnerRequestChanged');
  validateAction(current, action, actor, activePersonIds);
  const data = current.request_data;
  const revision =
    now > data.updatedAt
      ? now
      : new Date(new Date(data.updatedAt).getTime() + 1).toISOString();
  const updated = structuredClone(current);
  if (action === 'edit') {
    if (!partnerRequestIsValid(request))
      throw new Error('tr_partnerInvalidRequest');
    Object.assign(updated.request_data, editableData(request));
  }
  if (action === 'delete') updated.request_data._deleted = true;
  if (action === 'join')
    Object.assign(updated.request_data, {
      partner_uid: actor,
      arranged_at: revision,
    });
  if (action === 'cancel') {
    delete updated.request_data.partner_uid;
    delete updated.request_data.arranged_at;
  }
  updated.request_data.updatedAt = revision;
  if (action !== 'join') return [updated];
  return [
    updated,
    ...withdrawnRequests(records, withdrawRequestIds, actor, data.date, now),
  ];
};
