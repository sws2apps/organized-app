import { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { UserSessionItem } from './';
import { apiHostState, rootModalOpenState, userEmailState, userIDState, visitorIDState } from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';

const UserSessions = () => {
  const cancel = useRef();

  const { t } = useTranslation();

  const setModalOpen = useSetRecoilState(rootModalOpenState);
  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const userEmail = useRecoilValue(userEmailState);
  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const userID = useRecoilValue(userIDState);

  const [sessions, setSessions] = useState([]);

  const handleGetSessions = useCallback(async () => {
    try {
      if (apiHost !== '') {
        cancel.current = false;
        setModalOpen(true);

        const res = await fetch(`${apiHost}api/users/${userID}/sessions`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            email: userEmail,
          },
        });

        if (!cancel.current) {
          const data = await res.json();

          if (res.status === 200) {
            setModalOpen(false);
            setSessions(data);
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
  }, [apiHost, cancel, setAppMessage, setAppSeverity, setAppSnackOpen, setModalOpen, userEmail, userID, visitorID]);

  useEffect(() => {
    handleGetSessions();
  }, [handleGetSessions]);

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, [cancel]);

  return (
    <Box sx={{ marginTop: '10px', marginBottom: '20px' }}>
      <Typography>{t('settings.sessionsDesc')}</Typography>
      <Box
        sx={{
          maxWidth: '500px',
          borderRadius: '8px',
          marginTop: '20px',
        }}
      >
        {sessions.length > 0 &&
          sessions.map((session) => (
            <UserSessionItem key={session.visitorid} session={session} setSessions={(value) => setSessions(value)} />
          ))}
      </Box>
    </Box>
  );
};

export default UserSessions;
