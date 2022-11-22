import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import Typography from '@mui/material/Typography';
import { isCongWaitRequestState, isUserSignInState } from '../../../states/main';

const CongregationWait = () => {
  const { t } = useTranslation();

  const setUserSignIn = useSetRecoilState(isUserSignInState);
  const setIsCongWaitRequest = useSetRecoilState(isCongWaitRequestState);

  const handleSignIn = () => {
      setUserSignIn(true);
      setIsCongWaitRequest(false);
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
       <HourglassFullIcon
					color='success'
          sx={{
            fontSize: '60px',
            cursor: 'pointer',
          }}
        />
        <Typography>{t('login.congregationRequestExist')}</Typography>
      </Box>

      <Button variant="contained" onClick={handleSignIn}>
        OK
      </Button>
    </Container>
  );
};

export default CongregationWait;
