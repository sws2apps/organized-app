import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PublishersSortOption } from '@definition/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { publishersSortState, settingsState } from '@states/settings';
import useCurrentUser from '@hooks/useCurrentUser';

const usePublishersSort = () => {
  const settings = useRecoilValue(settingsState);
  const sortOption = useRecoilValue(publishersSortState);

  const { isAdmin } = useCurrentUser();

  const [fsgSortMethod, setFsgSortMethod] =
    useState<PublishersSortOption>(sortOption);

  const handleFsgSortMethodChange = async (value: PublishersSortOption) => {
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
    setFsgSortMethod(sortOption);
  }, [sortOption]);

  return { fsgSortMethod, handleFsgSortMethodChange, isAdmin };
};

export default usePublishersSort;
