import { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import DoNotTouchIcon from '@mui/icons-material/DoNotTouch';
import IconButton from '@mui/material/IconButton';
import PageviewIcon from '@mui/icons-material/Pageview';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { apiHostState, userEmailState, visitorIDState } from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { congIDState } from '../../states/congregation';

const CongregationFindPerson = ({ setMember }) => {
  const cancel = useRef();

  const { t } = useTranslation();

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const userEmail = useRecoilValue(userEmailState);
  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const congID = useRecoilValue(congIDState);

  const [search, setSearch] = useState('');
  const [result, setResult] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSearch = async () => {
    try {
      if (apiHost !== '' && search !== '') {
        cancel.current = false;

        setMember({});
        setResult({});
        setIsProcessing(true);

        const res = await fetch(`${apiHost}api/congregations/${congID}/members/find?search=${search}`, {
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
            if (data.message) {
              setResult(data);
            } else {
              setMember(data);
            }

            setIsProcessing(false);
            return;
          }

          if (res.status === 404) {
            setResult(data);
            setIsProcessing(false);
            return;
          }

          setIsProcessing(false);
          setAppMessage(data.message);
          setAppSeverity('warning');
          setAppSnackOpen(true);
        }
      }
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
    return () => {
      cancel.current = true;
    };
  }, [cancel]);

  return (
    <Box sx={{ marginTop: '10px' }}>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <PersonSearchIcon color="primary" sx={{ fontSize: '40px', marginRight: '10px' }} />
          <TextField
            id="email-standard-basic"
            label={t('login.email')}
            variant="standard"
            sx={{ minWidth: '350px' }}
            autoComplete="off"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
        <IconButton sx={{ top: '8px' }} onClick={handleSearch}>
          <PageviewIcon sx={{ fontSize: '40px' }} />
        </IconButton>
      </Box>
      {isProcessing && (
        <CircularProgress
          color="secondary"
          size={40}
          disableShrink={true}
          sx={{
            display: 'flex',
            margin: '80px auto',
          }}
        />
      )}
      {!isProcessing && result.message && (
        <Box
          sx={{
            marginTop: '20px',
            border: '1px outset',
            borderRadius: '8px',
            padding: '10px',
          }}
        >
          {result.message === 'ACCOUNT_NOT_FOUND' && (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '15px',
                }}
              >
                <DoNotTouchIcon color="error" sx={{ fontSize: '50px' }} />
              </Box>
              <Typography align="center">{t('administration.accountNotFound')}</Typography>
            </Box>
          )}
          {result.message === 'ALREADY_MEMBER' && (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '15px',
                }}
              >
                <AccountCircleIcon color="primary" sx={{ fontSize: '50px' }} />
              </Box>
              <Typography align="center">{t('administration.accountExist')}</Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CongregationFindPerson;
