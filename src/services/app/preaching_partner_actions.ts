import {
  PartnerMutation,
  PreachingPartnerRequestType,
} from '@definition/preaching_partner';
import { partnerRequestIsValid } from '@utils/preaching_partner';

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
  if (action === 'create') {
    if (
      current ||
      request.request_data.person_uid !== actor ||
      !partnerRequestIsValid(request)
    )
      throw new Error('tr_partnerInvalidRequest');
    const { date, flexible, start, end, type, comment } = request.request_data;
    return [
      {
        request_uid: request.request_uid,
        request_data: {
          date,
          flexible,
          start: flexible ? undefined : start,
          end: flexible ? undefined : end,
          type,
          comment: comment.trim(),
          person_uid: actor,
          _deleted: false,
          updatedAt: now,
        },
      },
    ];
  }
  if (
    !current ||
    current.request_data._deleted ||
    current.request_data.updatedAt !== request.request_data.updatedAt
  )
    throw new Error('tr_partnerRequestChanged');
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
  const revision =
    now > data.updatedAt
      ? now
      : new Date(new Date(data.updatedAt).getTime() + 1).toISOString();
  const updated = structuredClone(current);
  if (action === 'edit') {
    if (!partnerRequestIsValid(request))
      throw new Error('tr_partnerInvalidRequest');
    const { date, flexible, start, end, type, comment } = request.request_data;
    Object.assign(updated.request_data, {
      date,
      flexible,
      start: flexible ? undefined : start,
      end: flexible ? undefined : end,
      type,
      comment: comment.trim(),
    });
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
  const changes = [updated];
  if (action === 'join') {
    for (const own of records) {
      if (
        withdrawRequestIds.includes(own.request_uid) &&
        own.request_data.person_uid === actor &&
        !own.request_data._deleted &&
        !own.request_data.partner_uid &&
        own.request_data.date === data.date
      ) {
        changes.push({
          ...own,
          request_data: { ...own.request_data, _deleted: true, updatedAt: now },
        });
      }
    }
  }
  return changes;
};
