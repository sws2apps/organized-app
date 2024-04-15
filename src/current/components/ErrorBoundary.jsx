import { useRouteError } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import NavBar from './NavBar';
import { deleteAppDb } from '../indexedDb/dbUtility';

const ErrorBoundary = () => {
  const error = useRouteError();

  const { t } = useTranslation('ui');

  const handleReload = () => {
    window.location.href = './';
  };

  const handleDelete = async () => {
    const auth = await getAuth();

    await deleteAppDb();
    await signOut(auth);

    window.location.href = './';
  };

  return (
    <>
      <NavBar />
      <Box
        sx={{
          margin: '0 auto',
          maxWidth: '750px',
          padding: '10px',
          marginTop: '60px',
        }}
      >
        <Typography>Ooops</Typography>
        <Typography>{error.message || error.data}</Typography>
        <Typography sx={{ marginTop: '15px' }}>{t('errorReloadCPE')}</Typography>
        <Button variant="contained" color="info" sx={{ marginTop: '10px' }} onClick={handleReload}>
          {t('reloadApp')}
        </Button>
        <Typography sx={{ marginTop: '15px' }} color="error">
          {t('errorResetData')}
        </Typography>
        <Button variant="contained" color="error" sx={{ marginTop: '10px' }} onClick={handleDelete}>
          {t('reset')}
        </Button>
      </Box>
    </>
  );
};

export default ErrorBoundary;
