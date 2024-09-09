import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useFieldServiceGroups from './useFieldServiceGroups';
import FieldServiceGroupsContainer from '@features/congregation/field_service_groups';
import CreateGroup from '@features/congregation/field_service_groups/create_group';
import PageTitle from '@components/page_title';

const FieldServiceGroups = () => {
  const { t } = useAppTranslation();

  const { buttons, groupAddOpen, handleCloseGroupAdd } =
    useFieldServiceGroups();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
      }}
    >
      {groupAddOpen && (
        <CreateGroup open={groupAddOpen} onClose={handleCloseGroupAdd} />
      )}

      <PageTitle title={t('tr_fieldServiceGroups')} buttons={buttons} />

      <FieldServiceGroupsContainer />
    </Box>
  );
};

export default FieldServiceGroups;
