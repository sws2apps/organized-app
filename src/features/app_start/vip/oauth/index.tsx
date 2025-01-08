import Box from '@mui/material/Box';
import OAuthGoogle from './google';
import OAuthYahoo from './yahoo';
import OAuthEmail from './email';
import Typography from '@components/typography';
import useAppTranslation from '@hooks/useAppTranslation';

const OAuth = () => {
  const { t } = useAppTranslation();
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '48px',
      }}
    >
      <OAuthEmail />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '32px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              backgroundColor: 'var(--accent-300)',
              height: '1px',
              flex: 1,
            }}
          />
          <Typography className="body-regular" color="var(--accent-400)">
            {t('tr_orLogInWithLabel')}
          </Typography>
          <Box
            sx={{
              backgroundColor: 'var(--accent-300)',
              height: '1px',
              flex: 1,
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',
          }}
        >
          <OAuthGoogle />
          <OAuthYahoo />
        </Box>
      </Box>
    </Box>
  );
};

export default OAuth;
