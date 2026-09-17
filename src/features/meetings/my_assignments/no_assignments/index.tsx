import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import NoAssigmentsImg from '@assets/img/illustration_no_assigments.svg?component';
import Typography from '@components/typography';

const NoAssignments = () => {
  const { t } = useAppTranslation();

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        padding: '24px 0',
      }}
    >
      <NoAssigmentsImg viewBox="0 0 128 128" />
      <Stack spacing="8px">
        <Typography className="h2">{t('tr_noAssignmentsYet')}</Typography>
        <Typography color="var(--grey-400)" sx={{ maxWidth: '350px' }}>
          {t('tr_noAssignmentsYetDesc')}
        </Typography>
      </Stack>
    </Box>
  );
};

export default NoAssignments;
