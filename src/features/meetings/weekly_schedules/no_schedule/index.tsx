import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import Typography from '@components/typography';
import NoSchedulesErrorImg from '@assets/img/illustration_no_schedules_error.svg?component';

const NoSchedule = () => {
  const { t } = useAppTranslation();

  const { tabletDown } = useBreakpoints();

  return (
    <>
      <Box
        sx={{
          padding: '80px 24px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            flexDirection: tabletDown ? 'column' : 'row',
          }}
        >
          <NoSchedulesErrorImg viewBox="0 0 128 128" />

          <Stack
            spacing="16px"
            sx={{
              maxWidth: '640px',
            }}
          >
            <Typography className="h2">{t('tr_noSchedulesYet')}</Typography>
            <Typography color="var(--grey-400)">
              {t('tr_noSchedulesYetDesc')}
            </Typography>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default NoSchedule;
