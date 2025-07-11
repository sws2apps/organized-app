import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { PublicTalkType } from '@definition/schedules';
import { schedulesState } from '@states/schedules';
import { userDataViewState } from '@states/settings';
import { dbSchedUpdate } from '@services/dexie/schedules';
import { languageGroupsState } from '@states/field_service_groups';

const usePublicTalkTypeSelector = (week: string) => {
  const { t } = useAppTranslation();

  const { isGroup } = useCurrentUser();

  const schedules = useAtomValue(schedulesState);
  const dataView = useAtomValue(userDataViewState);
  const languageGroups = useAtomValue(languageGroupsState);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const host_group = useMemo(() => {
    if (languageGroups.length === 0) return;

    if (isGroup) {
      return {
        value: 'host',
        label: t('tr_hostCongregationShort'),
      };
    }

    return {
      value: 'group',
      label: t('tr_languageGroupShort'),
    };
  }, [languageGroups, t, isGroup]);

  const initialType = useMemo(() => {
    if (!schedule) return 'localSpeaker';

    return (
      schedule.weekend_meeting.public_talk_type.find(
        (record) => record.type === dataView
      )?.value ?? 'localSpeaker'
    );
  }, [schedule, dataView]);

  const [talkType, setTalkType] = useState(initialType);

  const handleSaveTalkType = async (value: string) => {
    const newValue = value as PublicTalkType;

    const talkType = structuredClone(schedule.weekend_meeting.public_talk_type);

    let typeData = talkType.find((record) => record.type === dataView);

    if (!typeData) {
      talkType.push({ type: dataView, updatedAt: '', value: newValue });
      typeData = talkType.find((record) => record.type === dataView);
    }

    typeData.updatedAt = new Date().toISOString();
    typeData.value = newValue;

    await dbSchedUpdate(week, { 'weekend_meeting.public_talk_type': talkType });
  };

  useEffect(() => {
    setTalkType(initialType);
  }, [initialType]);

  return { talkType, handleSaveTalkType, host_group };
};

export default usePublicTalkTypeSelector;
