import { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import CountrySelect from '../../components/CountrySelect';
import {
  isAppLoadState,
  isCongAccountCreateState,
  isSetupState,
  isUserSignInState,
  offlineOverrideState,
  startupProgressState,
  userEmailState,
  userIDState,
  userPasswordState,
} from '../../states/main';
import CongregationSelect from '../../components/CongregationSelect';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { apiCreateCongregation, apiUpdateCongregation } from '../../api/congregation';
import {
  congAccountConnectedState,
  congIDState,
  isAdminCongState,
  isUpdateForVerificationState,
  pocketMembersState,
} from '../../states/congregation';
import { encryptString } from '../../utils/swsEncryption';
import { dbUpdateAppSettings } from '../../indexedDb/dbAppSettings';
import { loadApp } from '../../utils/app';
import { runUpdater } from '../../utils/updater';

const CongregationCreate = () => {
  const cancel = useRef();

  const { t } = useTranslation('ui');

  const setUserSignIn = useSetRecoilState(isUserSignInState);
  const setIsCongAccountCreate = useSetRecoilState(isCongAccountCreateState);
  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setIsAdminCong = useSetRecoilState(isAdminCongState);
  const setCongID = useSetRecoilState(congIDState);
  const setUserID = useSetRecoilState(userIDState);
  const setIsSetup = useSetRecoilState(isSetupState);
  const setStartupProgress = useSetRecoilState(startupProgressState);
  const setOfflineOverride = useSetRecoilState(offlineOverrideState);
  const setCongAccountConnected = useSetRecoilState(congAccountConnectedState);
  const setIsAppLoad = useSetRecoilState(isAppLoadState);
  const setPocketMembers = useSetRecoilState(pocketMembersState);

  const userPwd = useRecoilValue(userPasswordState);
  const userEmail = useRecoilValue(userEmailState);
  const isUpdateCong = useRecoilValue(isUpdateForVerificationState);
  const congId = useRecoilValue(congIDState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [country, setCountry] = useState(null);
  const [congregation, setCongregation] = useState(null);

  const handleSignIn = () => {
    setUserSignIn(true);
    setIsCongAccountCreate(false);
  };

  const handleCongregationAction = async () => {
    try {
      setIsProcessing(true);

      const { status, data } = isUpdateCong
        ? await apiUpdateCongregation(congId, country.code, congregation.congName, congregation.congNumber)
        : await apiCreateCongregation(country.code, congregation.congName, congregation.congNumber);

      if (status === 200) {
        const { id, cong_id, cong_name, cong_role, cong_number, pocket_members } = data;

        if (cong_role.length > 0) {
          // role admin
          if (cong_role.includes('admin')) {
            setIsAdminCong(true);
          }

          // role approved
          if (cong_role.includes('lmmo') || cong_role.includes('lmmo-backup')) {
            setCongID(cong_id);
            // encrypt email & pwd
            const encPwd = await encryptString(userPwd, JSON.stringify({ email: userEmail, pwd: userPwd }));

            // save congregation update if any
            let obj = {};
            obj.username = data.username;
            obj.isCongUpdated2 = true;
            obj.cong_name = cong_name;
            obj.cong_number = cong_number;
            obj.userPass = encPwd;
            obj.isLoggedOut = false;
            obj.pocket_members = pocket_members;
            await dbUpdateAppSettings(obj);

            setUserID(id);
            setPocketMembers(pocket_members);

            await loadApp();

            setIsSetup(false);

            await runUpdater();
            setTimeout(() => {
              setStartupProgress(0);
              setOfflineOverride(false);
              setCongAccountConnected(true);
              setIsAppLoad(false);
            }, [2000]);
          }
          return;
        }
      } else if (status === 404) {
        setAppMessage(t('statup.congregationExists'));
        setAppSeverity('warning');
        setAppSnackOpen(true);
      } else {
        setAppMessage(data.message);
        setAppSeverity('warning');
        setAppSnackOpen(true);
      }
      setIsProcessing(false);
    } catch (err) {
      if (!cancel.current) {
        setIsProcessing(false);
        setAppMessage(err.message);
        setAppSeverity('error');
        setAppSnackOpen(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  return (
    <Container sx={{ marginTop: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '15px' }}>
        {isUpdateCong ? t('updateCongregation') : t('createCongregationAccount')}
      </Typography>

      {isUpdateCong && <Typography sx={{ marginBottom: '15px' }}>{t('statup.updateCongregationDesc')}</Typography>}

      <Box
        sx={{
          width: '100%',
          maxWidth: '500px',
          margin: '30px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <CountrySelect setCountry={(value) => setCountry(value)} />
        {country !== null && (
          <CongregationSelect country={country} setCongregation={(value) => setCongregation(value)} />
        )}
      </Box>

      <Box
        sx={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '500px',
          width: '100%',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        {!isUpdateCong && (
          <Link component="button" underline="none" variant="body2" onClick={handleSignIn}>
            {t('hasAccount')}
          </Link>
        )}

        <Button
          variant="contained"
          disabled={isProcessing}
          endIcon={isProcessing ? <CircularProgress size={25} /> : null}
          onClick={handleCongregationAction}
        >
          {isUpdateCong ? t('update') : t('create')}
        </Button>
      </Box>
    </Container>
  );
};

export default CongregationCreate;
