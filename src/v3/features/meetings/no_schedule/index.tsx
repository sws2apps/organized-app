import { Box } from '@mui/material';
import { IconRefresh } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';
import PageTitle from '@components/page_title';
import NoSchedulesErrorImg from '@assets/img/no-schedules-error-illustration.svg?component';
import useNoSchedule from './useNoSchedule';

const NoScheduleYetPage = () => {
  const { t } = useAppTranslation();

  const { handleReload } = useNoSchedule();

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <PageTitle title={t('tr_viewAssignmentsSchedule')} />
      <Box
        sx={{
          maxWidth: '702px',
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          flexDirection: { mobile: 'column-reverse', tablet: 'row' },
        }}
      >
        <NoSchedulesErrorImg />
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            flexDirection: 'column',
          }}
        >
          <Typography className="h1">{t('tr_noSchedulesYet')}</Typography>
          <TextMarkup
            content={t('tr_noSchedulesYetDesc')}
            className="body-regular"
            color="var(--grey-400)"
            anchorClassName="h4"
            anchorColor="var(--accent-dark)"
          />
          <Button
            variant="main"
            className="button-caps"
            onClick={handleReload}
            startIcon={<IconRefresh />}
          >
            {t('tr_refreshPage')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default NoScheduleYetPage;
