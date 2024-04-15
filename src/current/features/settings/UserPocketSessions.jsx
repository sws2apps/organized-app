import { useEffect, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import UserPocketSessionItem from './UserPocketSessionItem';
import { rootModalOpenState } from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { apiFetchPocketSessions } from '../../api/auth';

const UserPocketSessions = () => {
  const cancel = useRef();

  const { t } = useTranslation('ui');

  const { error, data, isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: apiFetchPocketSessions,
  });

  const setModalOpen = useSetRecoilState(rootModalOpenState);
  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (data) {
      setSessions(data);
    }
  }, [data]);

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
      <Typography sx={{ marginBottom: '10px' }}>{t('sessionsDesc')}</Typography>
      <Grid container flexGrow={1} spacing={2}>
        {sessions.length > 0 &&
          sessions.map((session) => <UserPocketSessionItem key={session.visitorid} device={session} />)}
      </Grid>
    </Box>
  );
};

export default UserPocketSessions;
