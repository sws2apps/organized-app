import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { IconError } from '@components/icons';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { VolunteerActivityType } from '@definition/volunteer_activities';
import {
  dbVolunteerActivitySave,
  dbVolunteerParticipantSave,
} from '@services/dexie/volunteer_activities';
import { displaySnackNotification } from '@services/states/app';
import {
  generateMonthNames,
  generateWeekday,
  getMessageByCode,
} from '@services/i18n/translation';
import { personsState } from '@states/persons';
import { fullnameOptionState, hour24FormatState } from '@states/settings';
import { volunteerActivityParticipantsState } from '@states/volunteer_activities';
import { buildPersonFullname } from '@utils/common';
import { formatDate } from '@utils/date';
import { VolunteerActivityProps } from './index.types';

const showError = (error: unknown) => {
  console.error(error);

  displaySnackNotification({
    header: getMessageByCode('error_app_generic-title'),
    message: (error as Error).message,
    severity: 'error',
    icon: <IconError color="var(--white)" />,
  });
};

const useVolunteerActivity = ({ data }: VolunteerActivityProps) => {
  const { t } = useAppTranslation();

  const { isAdmin, isPublisher, person } = useCurrentUser();

  const hour24 = useAtomValue(hour24FormatState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const persons = useAtomValue(personsState);
  const allParticipants = useAtomValue(volunteerActivityParticipantsState);

  const [isEdit, setIsEdit] = useState(false);

  const { activity_uid, activity_data } = data;

  const participants = useMemo(() => {
    return allParticipants
      .filter(
        (record) => record.participation_data.activity_uid === activity_uid
      )
      .map((record) => {
        const participant = persons.find(
          (p) => p.person_uid === record.participation_data.person_uid
        );

        return {
          uid: record.participation_uid,
          name: participant
            ? buildPersonFullname(
                participant.person_data.person_lastname.value,
                participant.person_data.person_firstname.value,
                fullnameOption
              )
            : '',
        };
      });
  }, [allParticipants, activity_uid, persons, fullnameOption]);

  const participationUid = `${activity_uid}_${person?.person_uid}`;

  const joined = participants.some((record) => record.uid === participationUid);

  const full =
    !activity_data.allow_extra &&
    participants.length >= activity_data.participant_goal;

  const start = new Date(activity_data.start);

  const closed = start.getTime() <= Date.now();

  const dateFormatted = t('tr_longDateWithYearAndDayLocale', {
    day: generateWeekday()[(start.getDay() + 6) % 7],
    month: generateMonthNames()[start.getMonth()],
    date: start.getDate(),
    year: start.getFullYear(),
  });

  const timeFormatted = formatDate(start, hour24 ? 'HH:mm' : 'h:mm aaa');

  let joinLabel = t('tr_joinActivity');

  if (joined) joinLabel = t('tr_cancel');
  else if (closed) joinLabel = t('tr_activitySignUpsClosed');
  else if (full) joinLabel = t('tr_activityFull');

  const handleToggleEdit = () => setIsEdit((prev) => !prev);

  const handleSaveActivity = async (activity: VolunteerActivityType) => {
    try {
      await dbVolunteerActivitySave(activity);
      setIsEdit(false);
    } catch (error) {
      showError(error);
    }
  };

  const handleToggleJoin = async () => {
    if (!person) return;

    try {
      await dbVolunteerParticipantSave({
        participation_uid: participationUid,
        participation_data: {
          _deleted: joined,
          updatedAt: new Date().toISOString(),
          activity_uid,
          person_uid: person.person_uid,
        },
      });
    } catch (error) {
      showError(error);
    }
  };

  return {
    isAdmin,
    canJoin: isPublisher && Boolean(person),
    isEdit,
    participants,
    joined,
    joinDisabled: !joined && (closed || full),
    joinLabel,
    dateFormatted,
    timeFormatted,
    handleToggleEdit,
    handleSaveActivity,
    handleToggleJoin,
  };
};

export default useVolunteerActivity;
