import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Typography from '@mui/material/Typography';
import { isUnauthorizedRoleState, isUserSignInState } from '../../states/main';

const UnauthorizedRole = () => {
  const { t } = useTranslation();

  const setUserSignIn = useSetRecoilState(isUserSignInState);
  const setIsUnauthorizedRole = useSetRecoilState(isUnauthorizedRoleState);

  const handleSignIn = () => {
    setUserSignIn(true);
    setIsUnauthorizedRole(false);
  };

  return (
    <Container sx={{ marginTop: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '15px' }}>
        {t('login.unauthorized')}
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
        <ReportProblemIcon
          color="error"
          sx={{
            fontSize: '60px',
            cursor: 'pointer',
          }}
        />
        <Typography>{t('login.unauthorizedRole')}</Typography>
      </Box>

      <Button variant="contained" onClick={handleSignIn}>
        OK
      </Button>
    </Container>
  );
};

export default UnauthorizedRole;
