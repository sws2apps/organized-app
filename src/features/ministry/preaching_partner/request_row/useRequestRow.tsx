import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { PreachingPartnerRowProps } from './index.types';
import {
  preachingPartnerTimeLabel,
  preachingPartnerTypeLabel,
} from '@services/app/preaching_partner';
import { buildPersonFullname } from '@utils/common';
import { fullnameOptionState, userLocalUIDState } from '@states/settings';
import { personsActiveState } from '@states/persons';
import { useAppTranslation } from '@hooks/index';

const useRequestRow = ({
  request,
  onEdit,
  onJoin,
  onCancel,
}: PreachingPartnerRowProps) => {
  const { t } = useAppTranslation();

  const persons = useAtomValue(personsActiveState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const userUID = useAtomValue(userLocalUIDState);

  const { person_uid, partner_uid } = request.request_data;

  const isMine = person_uid === userUID;
  const isArranged = !!partner_uid;

  const nameFor = useMemo(() => {
    return (uid?: string) => {
      const person = persons.find((record) => record.person_uid === uid);

      if (!person) return '';

      return buildPersonFullname(
        person.person_data.person_lastname.value,
        person.person_data.person_firstname.value,
        fullnameOption
      );
    };
  }, [persons, fullnameOption]);

  const timeLabel = preachingPartnerTimeLabel(request);

  const typeLabel = preachingPartnerTypeLabel(request.request_data.type);

  const publisherName = isMine ? t('tr_me') : nameFor(person_uid);

  // on my own arranged request the counterpart is whoever joined me
  const partnerName = isMine ? nameFor(partner_uid) : '';

  const action = useMemo(() => {
    if (isArranged) {
      return {
        label: t('tr_cancelArrangement'),
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

  return {
    isMine,
    isArranged,
    timeLabel,
    typeLabel,
    publisherName,
    partnerName,
    action,
  };
};

export default useRequestRow;
