import { useEffect, useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import { Markup } from 'interweave';
import { useTranslation } from 'react-i18next';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { isUserSignInState, isUserSignUpState } from '../../states/main';
import OAuth from './OAuth';

const SignIn = () => {
  const cancel = useRef();

  const { t } = useTranslation('ui');

  const setUserSignIn = useSetRecoilState(isUserSignInState);
  const setUserSignUp = useSetRecoilState(isUserSignUpState);

  const handleSignUp = () => {
    setUserSignUp(true);
    setUserSignIn(false);
  };

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  return (
    <Container sx={{ marginTop: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '15px' }}>
        {t('signIn')}
      </Typography>

      <Typography sx={{ marginBottom: '20px' }}>
        <Markup content={t('signInDesc')} />
      </Typography>

      <OAuth />

      <Link component="button" underline="none" variant="body1" onClick={handleSignUp} sx={{ marginTop: '15px' }}>
        {t('createSwsAccount')}
      </Link>
    </Container>
  );
};

export default SignIn;
