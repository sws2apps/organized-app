import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { usernameState } from '../../states/congregation';
import { accountTypeState, apiHostState, rootModalOpenState, userIDState, visitorIDState } from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import { Setting } from '../../classes/Setting';

const UserFullname = () => {
  const cancel = useRef();

  const { user } = useFirebaseAuth();
  const { t } = useTranslation('ui');

  const [username, setUsername] = useRecoilState(usernameState);

  const setModalOpen = useSetRecoilState(rootModalOpenState);
  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const userID = useRecoilValue(userIDState);
  const accountType = useRecoilValue(accountTypeState);

  const [tmpUsername, setTempUsername] = useState(username);
  const [isEdit, setIsEdit] = useState(false);

  const handleCancelChanges = () => {
    setTempUsername(username);
  };

  const handleUpdateUsername = async () => {
    try {
      if (apiHost !== '') {
        cancel.current = false;

        setModalOpen(true);

        const res = await fetch(`${apiHost}api/v2/users/${userID}/fullname`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            appclient: 'cpe',
            appversion: import.meta.env.PACKAGE_VERSION,
            visitorid: visitorID,
            uid: user.uid,
          },
          body: JSON.stringify({ fullname: tmpUsername }),
        });

        if (!cancel.curent) {
          const data = await res.json();

          if (res.status === 200) {
            await Setting.update({ username: tmpUsername });
            setModalOpen(false);
            setAppMessage(t('savedSuccess'));
            setAppSeverity('success');
            setAppSnackOpen(true);

            setUsername(data.fullname);
            return;
          }

          setModalOpen(false);
          setAppMessage(data.message);
          setAppSeverity('warning');
          setAppSnackOpen(true);
        }
      }
    } catch (err) {
      if (!cancel.current) {
        setModalOpen(false);
        setAppMessage(err.message);
        setAppSeverity('error');
        setAppSnackOpen(true);
      }
    }
  };

  useEffect(() => {
    setIsEdit(tmpUsername !== username);
  }, [tmpUsername, username]);

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, [cancel]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '20px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '5px',
        }}
      >
        <TextField
          id="settings-username"
          label={t('fullname')}
          variant="outlined"
          size="small"
          autoComplete="off"
          required={accountType === 'vip'}
          sx={{
            width: '320px',
            marginRight: '5px',
            marginBottom: '5px',
          }}
          InputProps={{ readOnly: accountType === 'pocket' }}
          value={tmpUsername}
          onChange={(e) => setTempUsername(e.target.value)}
        />
        {isEdit && (
          <Box sx={{ marginBottom: '5px' }}>
            <IconButton aria-label="save" color="success" sx={{ marginRight: '5px' }} onClick={handleUpdateUsername}>
              <CheckCircleIcon />
            </IconButton>
            <IconButton aria-label="cancel" color="error" sx={{ marginRight: '5px' }} onClick={handleCancelChanges}>
              <CancelIcon />
            </IconButton>
          </Box>
        )}
      </Box>
      {accountType === 'vip' && (
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            id="settings-email-address"
            label={t('email')}
            variant="outlined"
            size="small"
            autoComplete="off"
            sx={{
              width: '320px',
              marginRight: '5px',
              marginTop: '5px',
              marginBottom: '2px',
            }}
            value={user?.email || ''}
            InputProps={{
              readOnly: true,
            }}
          />
          <Typography sx={{ fontSize: '12px' }}>{t('emailLocked')}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default UserFullname;
