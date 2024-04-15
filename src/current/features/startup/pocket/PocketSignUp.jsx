import { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
  accountTypeState,
  isAccountChooseState,
  isAppLoadState,
  isOnlineState,
  isSetupState,
  isUnauthorizedRoleState,
  visitorIDState,
} from '../../../states/main';
import { congAccountConnectedState } from '../../../states/congregation';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../../states/notification';
import { getErrorMessage, loadApp, updateUserSettings } from '../../../utils/app';
import { apiPocketSignUp } from '../../../api/auth';
import { runUpdater } from '../../../utils/updater';
import { apiFetchSchedule } from '../../../api';
import { classesInitialize } from '../../../utils/classes';

const PocketSignUp = () => {
  const { t } = useTranslation('ui');

  const setAccountType = useSetRecoilState(accountTypeState);
  const setIsAccountChoose = useSetRecoilState(isAccountChooseState);
  const setIsSetup = useSetRecoilState(isSetupState);
  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setIsUnauthorizedRole = useSetRecoilState(isUnauthorizedRoleState);
  const setCongAccountConnected = useSetRecoilState(congAccountConnectedState);
  const setIsAppLoad = useSetRecoilState(isAppLoadState);

  const isOnline = useRecoilValue(isOnlineState);
  const visitorID = useRecoilValue(visitorIDState);

  const [code, setCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReturnChooser = () => {
    setAccountType('');
    setIsAccountChoose(true);
  };

  const handleSignUp = async () => {
    try {
      if (code.length < 10) {
        setAppMessage(getErrorMessage('INPUT_INVALID'));
        setAppSeverity('warning');
        setAppSnackOpen(true);
        return;
      }

      setIsProcessing(true);
      const { status, data } = await apiPocketSignUp(code);

      if (status !== 200) {
        setAppMessage(getErrorMessage(data.message));
        setAppSeverity('warning');
        setAppSnackOpen(true);
        setIsProcessing(false);
      }

      const { cong_role } = data;

      const approvedRole =
        cong_role.includes('view_meeting_schedule') ||
        cong_role.includes('elder') ||
        cong_role.includes('publisher') ||
        cong_role.includes('ms');

      if (!approvedRole) {
        setAccountType('');
        setIsUnauthorizedRole(true);
        return;
      }

      await classesInitialize();
      await loadApp();
      await runUpdater();
      await updateUserSettings(data);
      await apiFetchSchedule();
      setIsSetup(false);
      setTimeout(async () => {
        setCongAccountConnected(true);
        setIsAppLoad(false);
      }, [1000]);
    } catch (err) {
      setIsProcessing(false);
      setAppMessage(err.message);
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  };

  return (
    <Container sx={{ marginTop: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '15px' }}>
        {t('welcome')}
      </Typography>

      <Typography sx={{ marginBottom: '20px' }}>{t('accountSetup')}</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '290px' }}>
        <TextField
          sx={{
            width: '100%',
            '.MuiInputBase-input': {
              fontSize: '20px',
              textAlign: 'center',
              textTransform: 'uppercase',
            },
          }}
          id="outlined-signup-code"
          label={t('activationCode')}
          variant="outlined"
          autoComplete="off"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </Box>

      <Box
        sx={{
          marginTop: '20px',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <Button
          color="inherit"
          variant="contained"
          disabled={isProcessing}
          sx={{ color: 'black !important' }}
          onClick={handleReturnChooser}
        >
          {t('back')}
        </Button>
        <Button
          variant="contained"
          disabled={!isOnline || isProcessing || visitorID.toString().length === 0}
          endIcon={visitorID.toString().length === 0 || isProcessing ? <CircularProgress size={25} /> : null}
          onClick={handleSignUp}
        >
          {t('activate')}
        </Button>
      </Box>
    </Container>
  );
};

export default PocketSignUp;
