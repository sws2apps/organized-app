import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { BadgeColor } from '@definition/app';
import { PersonType } from '@definition/person';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification } from '@services/states/app';
import { IconCheckCircle, IconError } from '@components/icons';
import { dbPersonsDelete } from '@services/dexie/persons';
import {
  personIsAP,
  personIsElder,
  personIsFMF,
  personIsFR,
  personIsFS,
  personIsInactive,
  personIsMS,
  updateRecentPersons,
} from '@services/app/persons';
import { personsFilterOpenState, personsRecentState } from '@states/persons';
import { fullnameOptionState } from '@states/settings';
import { getMessageByCode } from '@services/i18n/translation';

const usePersonCard = (person: PersonType) => {
  const navigate = useNavigate();

  const { t } = useAppTranslation();

  const setPersonsRecent = useSetAtom(personsRecentState);

  const fullnameOption = useAtomValue(fullnameOptionState);
  const filterOpen = useAtomValue(personsFilterOpenState);

  const [isDeleting, setIsDeleting] = useState(false);

  const getPersonBadge = useCallback(() => {
    const isElder = personIsElder(person);
    const isMS = personIsMS(person);
    const isAP = personIsAP(person);
    const isFMF = personIsFMF(person);
    const isFR = personIsFR(person);
    const isFS = personIsFS(person);

    const isBaptized = person.person_data.publisher_baptized.active.value;
    const isUnbaptized = person.person_data.publisher_unbaptized.active.value;
    const isMidweek = person.person_data.midweek_meeting_student.active.value;
    const disqualified = person.person_data.disqualified.value;
    const isInactivePublisher = personIsInactive(person);
    const isFamilyHead = person.person_data?.family_members?.head ?? false

    const badges: { name: string; color: BadgeColor }[] = [];

    if (disqualified) {
      badges.push({ name: t('tr_disqualified'), color: 'red' });
    }

    if (isInactivePublisher) {
      badges.push({ name: t('tr_inactivePublisher'), color: 'red' });
    }

    if (!disqualified && !isInactivePublisher) {
      if (isElder) {
        badges.push({ name: t('tr_elder'), color: 'green' });
      }

      if (isMS) {
        badges.push({ name: t('tr_ministerialServant'), color: 'green' });
      }

      if (isAP) {
        badges.push({ name: t('tr_AP'), color: 'orange' });
      }

      if (isFMF) {
        badges.push({ name: t('tr_FMF'), color: 'orange' });
      }

      if (isFR) {
        badges.push({ name: t('tr_FR'), color: 'orange' });
      }

      if (isFS) {
        badges.push({ name: t('tr_FS'), color: 'orange' });
      }
    }

    const hasSpecialBadge =
      disqualified ||
      isInactivePublisher ||
      isElder ||
      isMS ||
      isAP ||
      isFMF ||
      isFR ||
      isFS;

    if (!hasSpecialBadge || disqualified) {
      if (isBaptized) {
        badges.push({ name: t('tr_baptizedPublisher'), color: 'grey' });
      }

      if (isUnbaptized) {
        badges.push({ name: t('tr_unbaptizedPublisher'), color: 'grey' });
      }

      if (isMidweek) {
        badges.push({ name: t('tr_midweekStudent'), color: 'grey' });
      }
    }

    if (isFamilyHead) {
      badges.push({ name: t('tr_familyHead'), color: 'accent' })
    }

    return badges.sort((a, b) => a.name.localeCompare(b.name));
  }, [t, person]);

  const handleDelete = () => setIsDeleting(true);

  const handleDeleteCancel = () => setIsDeleting(false);

  const handleDeleteConfirm = async () => {
    try {
      await dbPersonsDelete(person.person_uid);

      displaySnackNotification({
        header: t('tr_personDeleted'),
        message: t('tr_personDeletedDesc'),
        severity: 'success',
        icon: <IconCheckCircle color="var(--white)" />,
      });
    } catch (error) {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: error.message,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };

  const handleOpenPerson = async () => {
    const result = updateRecentPersons(person.person_uid, 'add');
    setPersonsRecent(result);

    navigate(`/persons/${person.person_uid}`);
  };

  return {
    badges: getPersonBadge(),
    isDeleting,
    handleDelete,
    handleDeleteCancel,
    handleDeleteConfirm,
    handleOpenPerson,
    fullnameOption,
    filterOpen,
  };
};

export default usePersonCard;
