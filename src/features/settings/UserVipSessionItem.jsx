import { useEffect, useRef } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import dateFormat from 'dateformat';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import Typography from '@mui/material/Typography';
import { apiHostState, rootModalOpenState, userIDState, visitorIDState } from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';

const UserSessionItem = ({ session, setSessions }) => {
  const cancel = useRef();

  const { t } = useTranslation('ui');

  const setModalOpen = useSetRecoilState(rootModalOpenState);
  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const userID = useRecoilValue(userIDState);

  const { user } = useFirebaseAuth();

  const lastSeen = session.last_seen ? dateFormat(new Date(session.last_seen), t('shortDateTimeFormat')) : '';

  const handleRevokeSession = async () => {
    try {
      if (apiHost !== '') {
        cancel.current = false;

        setModalOpen(true);

        const res = await fetch(`${apiHost}api/users/${userID}/sessions`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            appclient: 'cpe',
            appversion: import.meta.env.PACKAGE_VERSION,
            visitorid: visitorID,
            uid: user.uid,
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
          <Typography sx={{ fontSize: '14px' }}>{`${session.device.browserName} - ${session.device.os}`}</Typography>
          <Typography sx={{ fontSize: '14px' }}>{t('lastSeen', { last_seen: lastSeen })}</Typography>
          {visitorID === session.visitorid && (
            <Chip
              label={t('currentSession')}
              sx={{
                backgroundColor: '#145A32',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          )}
        </Box>
      </Box>
      {visitorID !== session.visitorid && (
        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
          <Button onClick={handleRevokeSession} variant="outlined" color="error" sx={{ marginBottom: '10px' }}>
            {t('sessionRevoke')}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default UserSessionItem;
