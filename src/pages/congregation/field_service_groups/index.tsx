import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useFieldServiceGroups from './useFieldServiceGroups';
import CreateGroup from '@features/congregation/field_service_groups/create_group';
import FieldServiceGroupsContainer from '@features/congregation/field_service_groups';
import GroupsReorder from '@features/congregation/field_service_groups/groups_reorder';
import PageTitle from '@components/page_title';

const FieldServiceGroups = () => {
  const { t } = useAppTranslation();

  const {
    buttons,
    groupAddOpen,
    handleCloseGroupAdd,
    handleCloseReorder,
    reorderOpen,
  } = useFieldServiceGroups();

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

      {reorderOpen && (
        <GroupsReorder open={reorderOpen} onClose={handleCloseReorder} />
      )}

      <PageTitle title={t('tr_fieldServiceGroups')} buttons={buttons} />

      <FieldServiceGroupsContainer />
    </Box>
  );
};

export default FieldServiceGroups;
