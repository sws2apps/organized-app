import { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import InfoIcon from '@mui/icons-material/Info';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CountrySelect from '../../../components/CountrySelect';
import {
  isAppLoadState,
  isCongAccountCreateState,
  isSetupState,
  isUserSignInState,
  offlineOverrideState,
  userIDState,
} from '../../../states/main';
import CongregationSelect from '../../../components/CongregationSelect';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../../states/notification';
import { apiCreateCongregation, apiFetchCongregations, apiUpdateCongregation } from '../../../api';
import {
  congAccountConnectedState,
  congIDState,
  isAdminCongState,
  isUpdateForVerificationState,
  userMembersDelegateState,
} from '../../../states/congregation';
import { loadApp } from '../../../utils/app';
import { runUpdater } from '../../../utils/updater';
import useFirebaseAuth from '../../../hooks/useFirebaseAuth';
import backupWorkerInstance from '../../../workers/backupWorker';
import { Setting } from '../../../classes/Setting';
import CongregationRole from './CongregationRole';

const CongregationCreate = () => {
  const { user } = useFirebaseAuth();

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
  const setOfflineOverride = useSetRecoilState(offlineOverrideState);
  const setCongAccountConnected = useSetRecoilState(congAccountConnectedState);
  const setIsAppLoad = useSetRecoilState(isAppLoadState);
  const setUserDelegate = useSetRecoilState(userMembersDelegateState);

  const isUpdateCong = useRecoilValue(isUpdateForVerificationState);
  const congId = useRecoilValue(congIDState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [country, setCountry] = useState(null);
  const [congregation, setCongregation] = useState(null);
  const [role, setRole] = useState('');
  const [userTmpFullname, setUserTmpFullname] = useState('');
  const [isCreate, setIsCreate] = useState(false);

  const handleSignIn = () => {
    setUserSignIn(true);
    setIsCongAccountCreate(false);
  };

  const handleCongregationAction = async () => {
    try {
      if (userTmpFullname.length === 0 || country === null || congregation === null || role.length === 0) {
        setAppMessage(t('missingInfo'));
        setAppSeverity('warning');
        setAppSnackOpen(true);
        setIsProcessing(false);
        return;
      }

      setIsProcessing(true);

      let status, data;
      if (isUpdateCong) {
        const tmp = await apiUpdateCongregation(congId, country.code, congregation.congName, congregation.congNumber);
        status = tmp.status;
        data = tmp.data;
      }

      if (!isUpdateCong) {
        const tmp = await apiCreateCongregation(
          country.code,
          congregation.congName,
          congregation.congNumber,
          role,
          userTmpFullname
        );
        status = tmp.status;
        data = tmp.data;
      }

      if (status === 200) {
        const { id, cong_id, cong_name, cong_role, cong_number, user_members_delegate } = data;

        if (cong_role.length > 0) {
          // role admin
          if (cong_role.includes('admin')) {
            setIsAdminCong(true);
          }

          // role approved
          if (
            cong_role.includes('lmmo') ||
            cong_role.includes('lmmo-backup') ||
            cong_role.includes('secretary') ||
            cong_role.includes('coordinator') ||
            cong_role.includes('public_talk_coordinator')
          ) {
            backupWorkerInstance.setCongID(cong_id);
            setCongID(cong_id);
            // save congregation update if any
            let obj = {};
            obj.username = data.username;
            obj.isCongUpdated2 = true;
            obj.cong_name = cong_name;
            obj.cong_number = cong_number;
            obj.user_members_delegate = user_members_delegate;
            await Setting.update(obj);

            setUserID(id);
            setUserDelegate(user_members_delegate);

            await loadApp();

            setIsSetup(false);

            await runUpdater();
            setTimeout(() => {
              setOfflineOverride(false);
              setCongAccountConnected(true);
              setIsAppLoad(false);
            }, [2000]);
          }
        }
        return;
      }

      if (status === 404) {
        setAppMessage(t('congregationExists'));
        setAppSeverity('warning');
        setAppSnackOpen(true);
        setIsProcessing(false);
        return;
      }

      setAppMessage(data.message);
      setAppSeverity('warning');
      setAppSnackOpen(true);
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
    if (user) {
      if (user.displayName && user.displayName !== null) {
        setUserTmpFullname(user.displayName);
        return;
      }

      if (
        user.displayName === null &&
        user.providerData[0]?.displayName &&
        user.providerData[0]?.displayName !== null
      ) {
        setUserTmpFullname(user.providerData[0].displayName);
        return;
      }

      setUserTmpFullname('');
    }
  }, [user]);

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  return (
    <Container sx={{ marginTop: '20px' }}>
      {!isCreate && (
        <Box>
          <Box
            sx={{
              display: 'flex',
              gap: '20px',
              margin: '30px 0',
              maxWidth: '480px',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <InfoIcon color="info" sx={{ fontSize: '60px' }} />
            <Typography>{t('accountCreated')}</Typography>
          </Box>
          <Box
            sx={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              maxWidth: '480px',
              width: '100%',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <Link component="button" underline="none" variant="body2" onClick={() => window.location.reload()}>
              {t('reloadApp')}
            </Link>

            <Button variant="contained" onClick={() => setIsCreate(true)}>
              {t('create')}
            </Button>
          </Box>
        </Box>
      )}
      {isCreate && (
        <Box>
          <Typography variant="h4" sx={{ marginBottom: '15px' }}>
            {isUpdateCong ? t('updateCongregation') : t('createCongregationAccount')}
          </Typography>

          {isUpdateCong && <Typography sx={{ marginBottom: '15px' }}>{t('updateCongregationDesc')}</Typography>}

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
            {!isUpdateCong && (
              <TextField
                sx={{ width: '100%' }}
                id="outlined-fullname"
                label={t('fullname')}
                variant="outlined"
                autoComplete="off"
                required
                value={userTmpFullname}
                onChange={(e) => setUserTmpFullname(e.target.value)}
              />
            )}

            <CountrySelect setCountry={(value) => setCountry(value)} />
            {country !== null && (
              <CongregationSelect
                country={country}
                setCongregation={(value) => setCongregation(value)}
                fetchCongregations={apiFetchCongregations}
              />
            )}
            {congregation !== null && <CongregationRole role={role} setRole={(value) => setRole(value)} />}
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
        </Box>
      )}
    </Container>
  );
};

export default CongregationCreate;
