import { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
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

  const handleSessions = async () => {
    if (apiHost !== '') {
      cancel.current = false;

      const res = await fetch(`${apiHost}api/users/${userID}/sessions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          visitorid: visitorID,
          email: userEmail,
        },
      });

      return await res.json();
    }
  };

  const { isLoading, error, data } = useQuery({ queryKey: ['sessions'], queryFn: handleSessions });

  useEffect(() => {
    if (data) {
      setSessions(data);
    }
  }, [data]);

  useEffect(() => {
    if (data && !cancel.current) {
      setSessions(data);
    }
  }, [data, cancel, setSessions]);

  useEffect(() => {
    if (error) {
      setModalOpen(false);
      setAppMessage(error);
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  }, [error, setAppMessage, setAppSeverity, setAppSnackOpen, setModalOpen]);

  useEffect(() => {
    setModalOpen(isLoading);
  }, [isLoading, setModalOpen]);

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
