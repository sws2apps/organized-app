import { GroupPublishersSortMethodOption } from '@definition/settings';
import useCurrentUser from '@hooks/useCurrentUser';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { settingsState } from '@states/settings';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

const useGroupPublishersSortMethodChange = () => {
  const settings = useRecoilValue(settingsState);

  const { isAdmin } = useCurrentUser();

  const [fsgSortMethod, setFsgSortMethod] =
    useState<GroupPublishersSortMethodOption>(
      GroupPublishersSortMethodOption.MANUAL
    );

  const handleFsgSortMethodChange = async (e) => {
    const newFsgSortMethod = structuredClone(
      settings.cong_settings.group_publishers_sort
    );

    newFsgSortMethod.value = e.target.value;
    newFsgSortMethod.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.group_publishers_sort': newFsgSortMethod,
    });
  };

  useEffect(() => {
    setFsgSortMethod(settings.cong_settings.group_publishers_sort.value);
  }, [settings]);

  return {
    fsgSortMethod,
    handleFsgSortMethodChange,
    isAdmin,
  };
};

export default useGroupPublishersSortMethodChange;
