import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { IconCancelCicle, IconCheckCircle } from '@components/icons';
import { CommitteeMemberProps } from './index.types';
import useSCMember from './useSCMember';
import Button from '@components/button';
import Typography from '@components/typography';

const CommitteeMember = ({ name, role }: CommitteeMemberProps) => {
  const { t } = useAppTranslation();

  const { isEdit } = useSCMember();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 'var(--radius-l)',
        padding: '8px 8px 8px 16px',
        border: '1px solid var(--accent-300)',
        '&:hover': {
          backgroundColor: isEdit && 'var(--accent-150)',
          border: isEdit && '1px solid var(--accent-main)',
        },
      }}
    >
      <Stack spacing="4px">
        <Typography className="h4">{name}</Typography>
        <Typography className="body-small-regular" color="var(--grey-01)">
          {role}
        </Typography>
      </Stack>

      {isEdit && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            variant="main"
            color="red"
            startIcon={<IconCancelCicle color="var(--always-white)" />}
            sx={{ minHeight: '40px', height: '40px' }}
          >
            {t('tr_reject')}
          </Button>
          <Button
            variant="main"
            startIcon={<IconCheckCircle color="var(--always-white)" />}
            sx={{ minHeight: '40px', height: '40px' }}
          >
            {t('tr_approve')}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CommitteeMember;
