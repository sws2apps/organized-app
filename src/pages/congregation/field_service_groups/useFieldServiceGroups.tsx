import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { IconAdd, IconReorder } from '@components/icons';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { fieldGroupsState } from '@states/field_service_groups';
import Button from '@components/button';
import ExportGroups from '@features/congregation/field_service_groups/export_groups';

const useFieldServiceGroups = () => {
  const { t } = useAppTranslation();

  const { isServiceCommittee } = useCurrentUser();

  const groups = useRecoilValue(fieldGroupsState);
  const [groupAddOpen, setGroupAddOpen] = useState(false);
  const [reorderOpen, setReorderOpen] = useState(false);

  const handleOpenGroupAdd = () => setGroupAddOpen(true);

  const handleCloseGroupAdd = () => setGroupAddOpen(false);

  const handleOpenReorder = () => setReorderOpen(true);

  const handleCloseReorder = () => setReorderOpen(false);

  const buttons = useMemo(() => {
    if (!isServiceCommittee) return <></>;

    return (
      <>
        {groups.length > 0 && <ExportGroups />}

        {groups.length > 1 && (
          <Button
            variant="secondary"
            onClick={handleOpenReorder}
            startIcon={<IconReorder color="var(--accent-main)" />}
          >
            {t('tr_reorderGroups')}
          </Button>
        )}

        <Button
          variant="main"
          onClick={handleOpenGroupAdd}
          startIcon={<IconAdd />}
        >
          {t('tr_createGroup')}
        </Button>
      </>
    );
  }, [t, groups, isServiceCommittee]);

  return {
    buttons,
    groupAddOpen,
    handleCloseGroupAdd,
    handleCloseReorder,
    reorderOpen,
  };
};

export default useFieldServiceGroups;
