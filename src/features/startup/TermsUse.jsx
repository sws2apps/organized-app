import { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { Markup } from 'interweave';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import HelpIcon from '@mui/icons-material/Help';
import HttpsIcon from '@mui/icons-material/Https';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';
import ReportIcon from '@mui/icons-material/Report';
import SecurityIcon from '@mui/icons-material/Security';
import Typography from '@mui/material/Typography';
import { isShowTermsUseState } from '../../states/main';
import { themeOptionsState } from '../../states/theme.js';

const itemQuestion = {
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
};

const itemTextQuestion = {
  fontWeight: 'bold',
  lineHeight: '1.2',
  marginLeft: '10px',
};

const itemAnswer = {
  marginBottom: '20px',
};

const itemParsAnswer = {
  lineHeight: '1.2',
  marginBottom: '10px',
};

const TermsUse = () => {
  const { t } = useTranslation('ui');

  const setShowTermsUse = useSetRecoilState(isShowTermsUseState);

  const themeOptions = useRecoilValue(themeOptionsState);

  const [readComplete, setReadComplete] = useState(false);

  const handleTermsUse = () => {
    localStorage.setItem('termsUse', false);
    setShowTermsUse(false);
  };

  return (
    <Container sx={{ padding: '15px' }}>
      <Typography textAlign="center" variant="h4" sx={{ marginBottom: '15px' }}>
        {t('welcome')}
      </Typography>
      <Box sx={itemQuestion}>
        <HelpIcon sx={{ color: '#3498DB', fontSize: '40px' }} />
        <Typography sx={itemTextQuestion}>{t('whoUse')}</Typography>
      </Box>

      <Box sx={itemAnswer}>
        <Typography sx={itemParsAnswer}>{t('whoUseApp')}</Typography>
        <Typography sx={itemParsAnswer}>{t('disclaimerApp')}</Typography>
      </Box>

      <Box sx={itemQuestion}>
        <InstallDesktopIcon sx={{ color: '#3498DB', fontSize: '40px' }} />
        <Typography sx={itemTextQuestion}>{t('appPWA')}</Typography>
      </Box>

      <Box sx={itemAnswer}>
        <Typography sx={itemParsAnswer}>
          <Markup content={t('descPWA')} />
        </Typography>
      </Box>

      <Box sx={itemQuestion}>
        <SecurityIcon sx={{ color: '#3498DB', fontSize: '40px' }} />
        <Typography sx={itemTextQuestion}>{t('appSecure')}</Typography>
      </Box>

      <Box sx={itemAnswer}>
        <Typography sx={itemParsAnswer}>{t('webChange')}</Typography>
        <Typography sx={itemParsAnswer}>{t('appStorage')}</Typography>
        <Typography sx={itemParsAnswer}>
          <Markup content={t('onlineShare')} />
        </Typography>
        <Box
          sx={{
            display: 'flex',
            backgroundColor: themeOptions.redNoteBg,
            padding: '10px',
            borderRadius: '10px',
          }}
        >
          <ReportIcon sx={{ fontSize: '30px', color: themeOptions.reportIconColor }} />
          <Typography sx={{ marginLeft: '10px', lineHeight: 1.2 }}>{t('clearBrowserData')}</Typography>
        </Box>
      </Box>

      <Box sx={itemQuestion}>
        <HttpsIcon sx={{ color: '#3498DB', fontSize: '40px' }} />
        <Typography sx={itemTextQuestion}>{t('appPrivacy')}</Typography>
      </Box>

      <Box sx={itemAnswer}>
        <Typography sx={itemParsAnswer}>
          <Markup content={t('dataCollection')} />
        </Typography>
        <Typography sx={itemParsAnswer}>{t('adBlock')}</Typography>
      </Box>
      <FormControlLabel
        control={
          <Checkbox id="checkContinue" checked={readComplete} onChange={(e) => setReadComplete(e.target.checked)} />
        }
        label={<Typography sx={{ lineHeight: 1.2 }}>{t('readComplete')}</Typography>}
        sx={{
          width: '100%',
        }}
      />
      <Button variant="contained" sx={{ marginTop: '10px' }} disabled={!readComplete} onClick={handleTermsUse}>
        {t('next')}
      </Button>
    </Container>
  );
};

export default TermsUse;
