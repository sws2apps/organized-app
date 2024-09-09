import { useMemo, useState } from 'react';
import { IconAdd } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';

const useFieldServiceGroups = () => {
  const { t } = useAppTranslation();

  const [groupAddOpen, setGroupAddOpen] = useState(false);

  const handleOpenGroupAdd = () => setGroupAddOpen(true);

  const handleCloseGroupAdd = () => setGroupAddOpen(false);

  const buttons = useMemo(() => {
    return (
      <Button
        variant="main"
        onClick={handleOpenGroupAdd}
        startIcon={<IconAdd />}
      >
        {t('tr_createGroup')}
      </Button>
    );
  }, [t]);

  return { buttons, groupAddOpen, handleCloseGroupAdd };
};

export default useFieldServiceGroups;
