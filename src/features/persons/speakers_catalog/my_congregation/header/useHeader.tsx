import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import {
  circuitNumberState,
  congNameState,
  congNumberState,
  userDataViewState,
} from '@states/settings';
import { congAccountConnectedState } from '@states/app';
import { languageGroupsState } from '@states/field_service_groups';

const useHeader = () => {
  const { t } = useAppTranslation();

  const { isGroup } = useCurrentUser();

  const congName = useAtomValue(congNameState);
  const congNumber = useAtomValue(congNumberState);
  const congAccountConnected = useAtomValue(congAccountConnectedState);
  const circuitNumber = useAtomValue(circuitNumberState);
  const dataView = useAtomValue(userDataViewState);
  const groups = useAtomValue(languageGroupsState);

  const [openAccess, setOpenAccess] = useState(false);

  const headerTitle = useMemo(() => {
    if (dataView === 'main') {
      return t('tr_yourCongregation');
    }

    const group = groups.find((record) => record.group_id === dataView);

    return group?.group_data.name ?? '';
  }, [dataView, t, groups]);

  const handleOpenAccess = () => setOpenAccess(true);

  const handleCloseAccess = () => setOpenAccess(false);

  return {
    congName,
    congNumber,
    circuitNumber,
    handleOpenAccess,
    handleCloseAccess,
    openAccess,
    congAccountConnected,
    headerTitle,
    isGroup,
  };
};

export default useHeader;
