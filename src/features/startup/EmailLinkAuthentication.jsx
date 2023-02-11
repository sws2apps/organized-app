import { useEffect, useRef, useState } from 'react';
import { getAuth, indexedDBLocalPersistence, setPersistence, signInWithCustomToken } from 'firebase/auth';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { apiUpdatePasswordlessInfo } from '../../api/auth';

const EmailLinkAuthentication = () => {
  const { t } = useTranslation('ui');

  const cancel = useRef();

  const [isProcessing, setIsProcessing] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const code = searchParams.get('code');

  const completeEmailAuth = async () => {
    setIsProcessing(true);
    const auth = getAuth();
    await setPersistence(auth, indexedDBLocalPersistence);
    const userCredential = await signInWithCustomToken(auth, code);
    const user = userCredential.user;

    cancel.current = false;

    const result = await apiUpdatePasswordlessInfo(user.uid);
    // refetch auth after email update
    await signInWithCustomToken(auth, code);

    if (result.isVerifyMFA) {
      setSearchParams('');
    }
    if (result.isSetupMFA) {
      setSearchParams('');
    }
    setIsProcessing(false);
  };

  const handleRequestNewLink = () => {
    setSearchParams('');
  };

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  return (
    <Container sx={{ marginTop: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '15px' }}>
        {t('emailAuth')}
      </Typography>

      <Box sx={{ maxWidth: '500px' }}>
        <Typography sx={{ marginBottom: '20px' }}>{t('emailAuthDescComplete')}</Typography>

        <Box
          sx={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <Link component="button" underline="none" variant="body1" onClick={handleRequestNewLink}>
            {t('resendEmailLink')}
          </Link>
          <Button
            variant="contained"
            disabled={isProcessing}
            endIcon={isProcessing ? <CircularProgress size={25} /> : null}
            onClick={completeEmailAuth}
          >
            {t('signIn')}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EmailLinkAuthentication;
