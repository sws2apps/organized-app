import { useCallback, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { IconAdd, IconPrint, IconReorder } from '@components/icons';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { fieldGroupsState } from '@states/field_service_groups';
import Button from '@components/button';
import { pdf } from '@react-pdf/renderer';
import TemplateFieldServiceGroupsDoc from '@views/congregation/field_service_groups';
import { personsState } from '@states/persons';
import { congNameState, fullnameOptionState } from '@states/settings';
import { saveAs } from 'file-saver';

const useFieldServiceGroups = () => {
  const { t } = useAppTranslation();

  const { isServiceCommittee } = useCurrentUser();

  const groups = useRecoilValue(fieldGroupsState);
  const persons = useRecoilValue(personsState);
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const congregationName = useRecoilValue(congNameState);

  const [groupAddOpen, setGroupAddOpen] = useState(false);
  const [reorderOpen, setReorderOpen] = useState(false);

  const handleOpenGroupAdd = () => setGroupAddOpen(true);

  const handleCloseGroupAdd = () => setGroupAddOpen(false);

  const handleOpenReorder = () => setReorderOpen(true);

  const handleCloseReorder = () => setReorderOpen(false);

  const handleExport = useCallback(async () => {
    const blob = await pdf(
      <TemplateFieldServiceGroupsDoc
        fieldServiceGroups={groups}
        persons={persons}
        fullnameOption={fullnameOption}
        congregationName={congregationName}
      />
    ).toBlob();

    const filename = `Field-service-groups.pdf`;

    saveAs(blob, filename);
  }, [groups, persons, fullnameOption, congregationName]);

  const buttons = useMemo(() => {
    if (!isServiceCommittee) return <></>;

    return (
      <>
        {groups.length !== 0 && (
          <Button
            variant="secondary"
            onClick={handleExport}
            startIcon={<IconPrint color="var(--accent-main)" />}
          >
            {t('tr_export')}
          </Button>
        )}

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
  }, [t, groups, isServiceCommittee, handleExport]);

  return {
    buttons,
    groupAddOpen,
    handleCloseGroupAdd,
    handleCloseReorder,
    reorderOpen,
  };
};

export default useFieldServiceGroups;
