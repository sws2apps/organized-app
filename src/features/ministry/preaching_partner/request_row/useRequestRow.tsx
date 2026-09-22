import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { PreachingPartnerRowProps } from './index.types';
import {
  preachingPartnerTimeLabel,
  preachingPartnerTypeLabel,
} from '@services/app/preaching_partner';
import { buildPersonFullname } from '@utils/common';
import { fullnameOptionState } from '@states/settings';
import { personsActiveState } from '@states/persons';
import { useAppTranslation } from '@hooks/index';
import { userLocalUIDState } from '@states/settings';

const useRequestRow = ({ request }: PreachingPartnerRowProps) => {
  const { t } = useAppTranslation();

  const persons = useAtomValue(personsActiveState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const userUID = useAtomValue(userLocalUIDState);

  const timeLabel = useMemo(
    () => preachingPartnerTimeLabel(request),
    [request]
  );

  const typeLabel = useMemo(
    () => preachingPartnerTypeLabel(request.request_data.type),
    [request]
  );

  const publisherName = useMemo(() => {
    if (request.request_data.person_uid === userUID) return t('tr_me');

    const person = persons.find(
      (record) => record.person_uid === request.request_data.person_uid
    );

    if (!person) return '';

    return buildPersonFullname(
      person.person_data.person_lastname.value,
      person.person_data.person_firstname.value,
      fullnameOption
    );
  }, [request, persons, fullnameOption, userUID, t]);

  return { timeLabel, typeLabel, publisherName };
};

export default useRequestRow;
