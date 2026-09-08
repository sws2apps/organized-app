import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useCurrentUser } from '@hooks/index';
import { userDataViewState } from '@states/settings';
import { languageGroupsState } from '@states/field_service_groups';

const useLanguageGroups = () => {
  const { isAdmin } = useCurrentUser();

  const dataView = useAtomValue(userDataViewState);
  const languageGroups = useAtomValue(languageGroupsState);

  const fullAccess = useMemo(() => {
    if (!isAdmin) return false;

    return dataView === 'main';
  }, [dataView, isAdmin]);

  const [isAdd, setIsAdd] = useState(false);

  const handleOpenAdd = () => setIsAdd(true);

  const handleCloseAdd = () => setIsAdd(false);

  return {
    isAdd,
    handleOpenAdd,
    handleCloseAdd,
    languageGroups,
    fullAccess,
  };
};

export default useLanguageGroups;
