import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { NewGroupMembersProps } from './index.types';
import Button from '@components/button';
import GroupMembers from '../../group_members';
import Typography from '@components/typography';

const NewGroupMembers = ({
  action,
  onBack,
  group,
  onChange,
}: NewGroupMembersProps) => {
  const { t } = useAppTranslation();

  return (
    <Stack spacing="24px">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Typography className="h2">
          {t('tr_groupNumber', {
            groupNumber: group.group_data.sort_index + 1,
          })}
        </Typography>
        <Typography color="var(--grey-400)">
          {t('tr_createNewGroupLastStep')}
        </Typography>
      </Box>

      <GroupMembers group={group} onChange={onChange} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
        }}
      >
        <Button variant="main" onClick={action}>
          {t('tr_create')}
        </Button>
        <Button variant="secondary" onClick={onBack}>
          {t('tr_back')}
        </Button>
      </Box>
    </Stack>
  );
};

export default NewGroupMembers;
