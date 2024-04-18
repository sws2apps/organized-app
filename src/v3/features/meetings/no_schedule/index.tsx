import { Box } from '@mui/material';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import { IconError } from '@icons/index';
import NoSchedulesErrorImg from '@assets/img/no-schedules-error-illustration.svg?component';

const UnauthorizedRole = () => {
  const { t } = useAppTranslation();

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
      <Box sx={{ maxWidth: '702px', display: 'flex', gap: '24px', alignItems: 'center' }}>
        <IconError width={72} height={72} color="var(--red-main)" />
        <NoSchedulesErrorImg />
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
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
        </Box>
      </Box>
    </Box>
  );
};

export default UnauthorizedRole;
