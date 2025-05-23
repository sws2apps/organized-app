import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { PublishersSortOption } from '@definition/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { publishersSortState, settingsState } from '@states/settings';

const usePublishersSort = () => {
  const settings = useAtomValue(settingsState);
  const sortOption = useAtomValue(publishersSortState);

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

  return { fsgSortMethod, handleFsgSortMethodChange };
};

export default usePublishersSort;
