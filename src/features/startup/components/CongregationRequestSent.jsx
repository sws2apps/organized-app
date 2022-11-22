import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { isCongRequestSentState, isUserSignInState } from '../../../states/main';

const CongregationRequestSent = () => {
  const { t } = useTranslation();

  const setUserSignIn = useSetRecoilState(isUserSignInState);
  const setIsCongRequestSent = useSetRecoilState(isCongRequestSentState);

  const handleSignIn = () => {
    setUserSignIn(true);
    setIsCongRequestSent(false);
  };

  return (
    <Container sx={{ marginTop: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '15px' }}>
        {t('login.createCongregationAccount')}
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
        <CheckCircleIcon
          color="success"
          sx={{
            fontSize: '60px',
            cursor: 'pointer',
          }}
        />
        <Typography>{t('login.requestAccountSent')}</Typography>
      </Box>

      <Button variant="contained" onClick={handleSignIn}>
        OK
      </Button>
    </Container>
  );
};

export default CongregationRequestSent;
