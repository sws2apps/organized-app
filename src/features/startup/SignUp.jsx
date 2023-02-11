import { useEffect, useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { isUserSignInState, isUserSignUpState } from '../../states/main';
import OAuth from './OAuth';

const SignUp = () => {
  const cancel = useRef();

  const { t } = useTranslation('ui');

  const setUserSignIn = useSetRecoilState(isUserSignInState);
  const setUserSignUp = useSetRecoilState(isUserSignUpState);

  const handleSignIn = () => {
    setUserSignIn(true);
    setUserSignUp(false);
  };

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  return (
    <Container sx={{ marginTop: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '15px' }}>
        {t('createSwsAccount')}
      </Typography>

      <Typography sx={{ marginBottom: '20px' }}>{t('newUserAccount')}</Typography>

      <OAuth />

      <Link component="button" underline="none" variant="body1" onClick={handleSignIn} sx={{ marginTop: '15px' }}>
        {t('hasAccount')}
      </Link>

      <Box
        sx={{ fontSize: '14px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '25px' }}
      >
        <Typography sx={{ fontSize: '14px' }}>{t('oauthAccept')}</Typography>
        <Link target="_blank" rel="noopener" href="https://sws2apps.github.io/sws2apps-docs/terms">
          {t('termsUse')}
        </Link>
        <Link target="_blank" rel="noopener" href="https://sws2apps.github.io/sws2apps-docs/privacy">
          {t('privacyPolicy')}
        </Link>
      </Box>
    </Container>
  );
};

export default SignUp;
