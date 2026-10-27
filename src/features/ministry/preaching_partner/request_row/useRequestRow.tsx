import { partnerDemoMode } from '@constants/index';
import { isOnlineState } from '@states/app';
import {
  partnerCacheState,
  partnerCanCreateState,
} from '@states/preaching_partner';
import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { PreachingPartnerRowProps } from '@features/ministry/preaching_partner/request_row/index.types';
import {
  preachingPartnerTimeLabel,
  preachingPartnerTypeLabel,
} from '@services/app/preaching_partner';
import { buildPersonFullname } from '@utils/common';
import { formatLongDateWithShortVars } from '@utils/date';
import {
  hour24FormatState,
  fullnameOptionState,
  userLocalUIDState,
} from '@states/settings';
import { personsActiveState } from '@states/persons';
import { useAppTranslation } from '@hooks/index';

const useRequestRow = ({
  request,
  onEdit,
  onJoin,
  onCancel,
}: PreachingPartnerRowProps) => {
  const { t } = useAppTranslation();

  useAtomValue(hour24FormatState);
  const canCreate = useAtomValue(partnerCanCreateState);
  const cache = useAtomValue(partnerCacheState);
  const online = useAtomValue(isOnlineState);
  const pending = cache.pending.find(
    (entry) => entry.mutation.request.request_uid === request.request_uid
  );
  const persons = useAtomValue(personsActiveState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const userUID = useAtomValue(userLocalUIDState);

  const { person_uid, partner_uid } = request.request_data;

  const isMine = person_uid === userUID;
  const isArranged = !!partner_uid;
  const canAct =
    canCreate &&
    (!pending || !!pending.error) &&
    (partnerDemoMode || (isMine && !isArranged) || online);

  const nameFor = useMemo(() => {
    return (uid?: string) => {
      const person = persons.find((record) => record.person_uid === uid);

      if (!person) return t('tr_partnerUnavailable');

      return buildPersonFullname(
        person.person_data.person_lastname.value,
        person.person_data.person_firstname.value,
        fullnameOption
      );
    };
  }, [persons, fullnameOption, t]);

  const timeLabel = preachingPartnerTimeLabel(request);

  const typeLabel = preachingPartnerTypeLabel(request.request_data.type);

  const publisherName = isMine ? t('tr_me') : nameFor(person_uid);

  // on my own arranged request the counterpart is whoever joined me
  const partnerName = isMine ? nameFor(partner_uid) : '';

  const action = useMemo(() => {
    if (isArranged) {
      return {
        label: t('tr_cancel'),
        variant: 'cancel' as const,
        onClick: () => onCancel?.(request),
      };
    }

    if (isMine) {
      return {
        label: t('tr_edit'),
        variant: 'edit' as const,
        onClick: () => onEdit?.(request),
      };
    }

    return {
      label: t('tr_join'),
      variant: 'join' as const,
      onClick: () => onJoin?.(request),
    };
  }, [isArranged, isMine, request, onCancel, onEdit, onJoin, t]);

  // every row's button reads the same, so it names what it acts on
  const actionAriaLabel = `${action.label}: ${publisherName}, ${formatLongDateWithShortVars(
    request.request_data.date
  )}, ${timeLabel}`;

  return {
    canAct,
    pending,
    isMine,
    isArranged,
    timeLabel,
    typeLabel,
    publisherName,
    partnerName,
    action,
    actionAriaLabel,
  };
};

export default useRequestRow;
