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
  const { t } = useTranslation();

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
        {t('startup.welcome')}
      </Typography>
      <Box sx={itemQuestion}>
        <HelpIcon sx={{ color: '#3498DB', fontSize: '40px' }} />
        <Typography sx={itemTextQuestion}>{t('startup.whoUse')}</Typography>
      </Box>

      <Box sx={itemAnswer}>
        <Typography sx={itemParsAnswer}>{t('startup.whoUseApp')}</Typography>
        <Typography sx={itemParsAnswer}>{t('startup.disclaimerApp')}</Typography>
      </Box>

      <Box sx={itemQuestion}>
        <InstallDesktopIcon sx={{ color: '#3498DB', fontSize: '40px' }} />
        <Typography sx={itemTextQuestion}>{t('startup.appPWA')}</Typography>
      </Box>

      <Box sx={itemAnswer}>
        <Typography sx={itemParsAnswer}>
          <Markup content={t('startup.descPWA')} />
        </Typography>
      </Box>

      <Box sx={itemQuestion}>
        <SecurityIcon sx={{ color: '#3498DB', fontSize: '40px' }} />
        <Typography sx={itemTextQuestion}>{t('startup.appSecure')}</Typography>
      </Box>

      <Box sx={itemAnswer}>
        <Typography sx={itemParsAnswer}>{t('startup.webChange')}</Typography>
        <Typography sx={itemParsAnswer}>{t('startup.appStorage')}</Typography>
        <Typography sx={itemParsAnswer}>
          <Markup content={t('startup.onlineShare')} />
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
          <Typography sx={{ marginLeft: '10px', lineHeight: 1.2 }}>{t('startup.clearBrowserData')}</Typography>
        </Box>
      </Box>

      <Box sx={itemQuestion}>
        <HttpsIcon sx={{ color: '#3498DB', fontSize: '40px' }} />
        <Typography sx={itemTextQuestion}>{t('startup.appPrivacy')}</Typography>
      </Box>

      <Box sx={itemAnswer}>
        <Typography sx={itemParsAnswer}>
          <Markup content={t('startup.dataCollection')} />
        </Typography>
        <Typography sx={itemParsAnswer}>{t('startup.adBlock')}</Typography>
      </Box>
      <FormControlLabel
        control={
          <Checkbox id="checkContinue" checked={readComplete} onChange={(e) => setReadComplete(e.target.checked)} />
        }
        label={<Typography sx={{ lineHeight: 1.2 }}>{t('startup.readComplete')}</Typography>}
        sx={{
          width: '100%',
        }}
      />
      <Button variant="contained" sx={{ marginTop: '10px' }} disabled={!readComplete} onClick={handleTermsUse}>
        {t('startup.next')}
      </Button>
    </Container>
  );
};

export default TermsUse;
