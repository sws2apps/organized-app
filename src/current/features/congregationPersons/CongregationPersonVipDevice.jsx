import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import dateFormat from 'dateformat';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { visitorIDState } from '../../states/main';

const CongregationPersonVipDevice = ({ session, handleRevokeSession }) => {
  const { t } = useTranslation('ui');

  const visitorID = useRecoilValue(visitorIDState);

  const formatLastSeen = (last_seen) => {
    return last_seen ? dateFormat(new Date(last_seen), t('shortDateTimeFormat')) : '';
  };

  const getInfoIP = () => {
    let result = session.visitor_details.ip;

    if (session.visitor_details.ipLocation?.country_name) {
      result += ` - ${session.visitor_details.ipLocation.country_name}`;
    }

    return result;
  };

  return (
    <Grid item xs={12} lg={6}>
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <GpsFixedIcon sx={{ fontSize: '60px', marginRight: '10px', color: '#1976d2' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>{`IP: ${getInfoIP()}`}</Typography>
              <Typography>{session.visitor_details.browser || ''}</Typography>
              <Typography>{t('lastSeen', { last_seen: formatLastSeen(session.sws_last_seen) })}</Typography>
              {visitorID === session.visitorid && (
                <Box>
                  <Chip
                    label={t('currentSession')}
                    sx={{
                      backgroundColor: '#145A32',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
          {visitorID !== session.visitorid && (
            <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="error"
                sx={{ marginBottom: '10px' }}
                onClick={() => handleRevokeSession(session.visitorid)}
              >
                {t('sessionRevoke')}
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Grid>
  );
};

export default CongregationPersonVipDevice;
