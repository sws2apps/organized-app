import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { IconError } from '@components/icons';
import { useCurrentUser } from '@hooks/index';
import {
  DEFAULT_ACTIVITY_START_HOUR,
  VolunteerActivityType,
} from '@definition/volunteer_activities';
import { dbVolunteerActivitySave } from '@services/dexie/volunteer_activities';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { userDataViewState } from '@states/settings';
import { volunteerActivitiesState } from '@states/volunteer_activities';
import { addDays } from '@utils/date';

const useVolunteerActivities = () => {
  const { isAdmin } = useCurrentUser();

  const activities = useAtomValue(volunteerActivitiesState);
  const dataView = useAtomValue(userDataViewState);

  const [isAdding, setIsAdding] = useState(false);

  const start = addDays(new Date(), 1);
  start.setHours(DEFAULT_ACTIVITY_START_HOUR, 0, 0, 0);

  // deliberately not memoised: the add form seeds its state from this on
  // mount, so a stable uid would make a second activity save over the first
  const emptyActivity: VolunteerActivityType = {
    activity_uid: crypto.randomUUID(),
    activity_data: {
      _deleted: false,
      updatedAt: new Date().toISOString(),
      type: dataView,
      name: '',
      description: '',
      start: start.toISOString(),
      participant_goal: 1,
      allow_extra: true,
    },
  };

  const handleShowAdd = () => setIsAdding(true);

  const handleHideAdd = () => setIsAdding(false);

  const handleSaveActivity = async (activity: VolunteerActivityType) => {
    try {
      await dbVolunteerActivitySave(activity);
      handleHideAdd();
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: (error as Error).message,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };

  return {
    isAdmin,
    activities,
    emptyActivity,
    isAdding,
    handleShowAdd,
    handleHideAdd,
    handleSaveActivity,
  };
};

export default useVolunteerActivities;
