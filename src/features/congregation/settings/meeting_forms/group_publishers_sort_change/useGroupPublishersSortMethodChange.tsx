import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { GroupPublishersSortMethodOption } from '@definition/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import {
  groupPublishersSortMethodState,
  settingsState,
} from '@states/settings';
import useCurrentUser from '@hooks/useCurrentUser';

const useGroupPublishersSortMethodChange = () => {
  const settings = useRecoilValue(settingsState);
  const sortMethod = useRecoilValue(groupPublishersSortMethodState);

  const { isAdmin } = useCurrentUser();

  const [fsgSortMethod, setFsgSortMethod] =
    useState<GroupPublishersSortMethodOption>(sortMethod);

  const handleFsgSortMethodChange = async (
    value: GroupPublishersSortMethodOption
  ) => {
    const newFsgSortMethod = settings.cong_settings.group_publishers_sort
      ? structuredClone(settings.cong_settings.group_publishers_sort)
      : { value: null, updatedAt: '' };

    newFsgSortMethod.value = value;
    newFsgSortMethod.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.group_publishers_sort': newFsgSortMethod,
    });
  };

  useEffect(() => {
    setFsgSortMethod(sortMethod);
  }, [sortMethod]);

  return {
    fsgSortMethod,
    handleFsgSortMethodChange,
    isAdmin,
  };
};

export default useGroupPublishersSortMethodChange;
