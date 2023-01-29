import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import BlockIcon from '@mui/icons-material/Block';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { isEmailBlockedState, isUserSignInState } from '../../states/main';

const EmailBlocked = () => {
  const { t } = useTranslation('ui');

  const setUserSignIn = useSetRecoilState(isUserSignInState);
  const setEmailBlocked = useSetRecoilState(isEmailBlockedState);

  const handleSignIn = () => {
    setUserSignIn(true);
    setEmailBlocked(false);
  };

  return (
    <Container sx={{ marginTop: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '15px' }}>
        {t('blockedEmailTitle')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '20px',
          margin: '30px 0',
        }}
      >
        <BlockIcon
          color="error"
          sx={{
            fontSize: '60px',
            cursor: 'pointer',
          }}
        />
        <Typography>{t('blockedAccount')}</Typography>
      </Box>

      <Button variant="contained" onClick={handleSignIn}>
        OK
      </Button>
    </Container>
  );
};

export default EmailBlocked;
