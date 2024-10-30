import { Box, Stack } from '@mui/material';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import Typography from '@components/typography';
import NoSchedulesErrorImg from '@assets/img/no-schedules-error-illustration.svg?url';

const NoSchedule = () => {
  const { t } = useAppTranslation();

  const { tabletDown } = useBreakpoints();

  const { isMeetingEditor } = useCurrentUser();

  return (
    <>
      {!isMeetingEditor && (
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
              maxWidth: '800px',
              flexDirection: tabletDown ? 'column' : 'row',
            }}
          >
            <img
              alt=""
              src={NoSchedulesErrorImg}
              style={{ width: '128px', height: '128px' }}
            />

            <Stack spacing="16px">
              <Typography className="h2">{t('tr_noSchedulesYet')}</Typography>
              <Typography color="var(--grey-400)">
                {t('tr_noSchedulesYetDesc')}
              </Typography>
            </Stack>
          </Box>
        </Box>
      )}
    </>
  );
};

export default NoSchedule;
