import { useEffect, useRef, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import UserVipSessionItem from './UserVipSessionItem';
import { apiHostState, rootModalOpenState, userIDState, visitorIDState } from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';

const UserVipSessions = () => {
  const cancel = useRef();

  const { t } = useTranslation('ui');

  const setModalOpen = useSetRecoilState(rootModalOpenState);
  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const userID = useRecoilValue(userIDState);

  const [sessions, setSessions] = useState([]);

  const handleSessions = async () => {
    if (apiHost !== '') {
      cancel.current = false;

      const auth = getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/users/${userID}/sessions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
        },
      });

      return await res.json();
    }
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ['sessions'],
    queryFn: handleSessions,
  });

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
      <Typography>{t('sessionsDesc')}</Typography>
      <Box
        sx={{
          maxWidth: '500px',
          borderRadius: '8px',
          marginTop: '20px',
        }}
      >
        {sessions.length > 0 &&
          sessions.map((session) => (
            <UserVipSessionItem key={session.visitorid} session={session} setSessions={(value) => setSessions(value)} />
          ))}
      </Box>
    </Box>
  );
};

export default UserVipSessions;
