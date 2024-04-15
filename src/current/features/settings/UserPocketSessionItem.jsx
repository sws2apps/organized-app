import { useEffect, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import dateFormat from 'dateformat';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import DevicesIcon from '@mui/icons-material/Devices';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { rootModalOpenState, visitorIDState } from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { getErrorMessage } from '../../utils/app';
import { apiFetchPocketSessions, apiPocketDeviceDelete } from '../../api';

const UserPocketSessionItem = ({ device }) => {
  const cancel = useRef();

  const { t } = useTranslation('ui');

  const queryClient = useQueryClient();

  const setRootModalOpen = useSetRecoilState(rootModalOpenState);
  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const visitorID = useRecoilValue(visitorIDState);

  const formatLastSeen = (last_seen) => {
    return last_seen ? dateFormat(new Date(last_seen), t('shortDateTimeFormat')) : '';
  };

  const handleDeleteDevice = async () => {
    try {
      setRootModalOpen(true);
      const { status, data } = await apiPocketDeviceDelete(device.visitorid);

      if (status === 200) {
        await queryClient.prefetchQuery({
          queryKey: ['devices'],
          queryFn: apiFetchPocketSessions,
        });
        setAppMessage(getErrorMessage('DEVICE_REMOVED'));
        setAppSeverity('success');
        setAppSnackOpen(true);
      } else {
        setAppMessage(getErrorMessage(data.message));
        setAppSeverity('warning');
        setAppSnackOpen(true);
      }
      setRootModalOpen(false);
    } catch (err) {
      setRootModalOpen(false);
      setAppMessage(err.message);
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  };

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, [cancel]);

  return (
    <Grid item xs={12} sm={6} lg={4}>
      <Paper elevation={8} sx={{ padding: '10px' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <DevicesIcon
              sx={{
                fontSize: '60px',
                marginRight: '10px',
                color: '#1976d2',
              }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <Typography
                sx={{ fontSize: '14px' }}
              >{`IP: ${device.visitor_details.ip} - ${device.visitor_details.ipLocation.country_name}`}</Typography>
              <Box>
                <Chip
                  label={formatLastSeen(device.sws_last_seen)}
                  sx={{
                    backgroundColor: '#1976d2',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
              </Box>
            </Box>
          </Box>
          {visitorID !== device.visitorid && (
            <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
              <Button variant="outlined" color="error" sx={{ marginBottom: '10px' }} onClick={handleDeleteDevice}>
                {t('sessionRevoke')}
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Grid>
  );
};

export default UserPocketSessionItem;
