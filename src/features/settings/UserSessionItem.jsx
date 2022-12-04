import { useEffect, useRef } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import dateFormat from 'dateformat';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import Typography from '@mui/material/Typography';
import { apiHostState, rootModalOpenState, userEmailState, userIDState, visitorIDState } from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';

const UserSessionItem = ({ session, setSessions }) => {
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

  const lastSeen = session.last_seen ? dateFormat(new Date(session.last_seen), t('global.shortDateTimeFormat')) : '';

  const handleRevokeSession = async () => {
    try {
      if (apiHost !== '') {
        cancel.current = false;

        setModalOpen(true);

        const res = await fetch(`${apiHost}api/users/${userID}/sessions`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            email: userEmail,
          },
          body: JSON.stringify({ session: session.visitorid }),
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
  };

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, [cancel]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        borderBottom: '1px outset',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <GpsFixedIcon sx={{ fontSize: '60px', marginRight: '10px', color: '#1976d2' }} />
        <Box>
          <Typography sx={{ fontSize: '14px' }}>{`${session.ip} - ${session.country_name}`}</Typography>
          <Typography
            sx={{ fontSize: '14px' }}
          >{`${session.device.browserName} (${session.device.os} ${session.device.osVersion})`}</Typography>
          <Typography sx={{ fontSize: '14px' }}>{t('settings.lastSeen', { last_seen: lastSeen })}</Typography>
          {visitorID === session.visitorid && (
            <Chip
              label={t('settings.currentSession')}
              sx={{
                backgroundColor: '#145A32',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          )}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
        <Button onClick={handleRevokeSession} variant="outlined" color="error" sx={{ marginBottom: '10px' }}>
          {t('settings.sessionRevoke')}
        </Button>
      </Box>
    </Box>
  );
};

export default UserSessionItem;
