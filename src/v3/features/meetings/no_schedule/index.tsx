import { Box } from '@mui/material';
import Button from '@components/button';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';
import PageTitle from '@components/page_title';
import { useAppTranslation } from '@hooks/index';
import { IconRefresh } from '@components/icons/index';
import NoSchedulesErrorImg from '@assets/img/no-schedules-error-illustration.svg?component';

const NoScheduleYetPage = () => {
  const { t } = useAppTranslation();
  const handleReload = () => {
    window.location.reload();
  };

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
          <Button variant="main" className="button-caps" onClick={handleReload} startIcon={<IconRefresh />}>
            {t('tr_refreshPage')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default NoScheduleYetPage;
