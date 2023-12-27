import { Box, Container } from '@mui/material';
import { Button, Typography } from '@components';
import { NavBar } from '@layouts/index';
import { IconRefresh, IconRestart } from '@icons';
import { useAppTranslation } from '@hooks';
import useError from './useError';

const ErrorBoundary = () => {
  const { error, handleReload, handleDelete } = useError();

  const { t } = useAppTranslation();

  return (
    <>
      <NavBar />
      <Container
        maxWidth={false}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '702px',
          padding: { mobile: '16px', tablet: '24px', display: 'flex', flexDirection: 'column' },
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Typography variant="h1" color="var(--black)">
          {t('trans_errorHeaderText')}
        </Typography>
        <Typography variant="button-caps" color="var(--grey-400)">
          {error.message || error.data}
        </Typography>
        <Typography variant="body-regular" color="var(--grey-400)">
          {t('trans_errorActionText')}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            alignSelf: 'stretch',
            justifyContent: 'space-between',
            gap: '8px',
            flexDirection: { mobile: 'column-reverse', tablet: 'row' },
          }}
        >
          <Button
            variant="secondary"
            color="red"
            className="button-caps"
            onClick={handleDelete}
            startIcon={<IconRestart />}
          >
            {t('trans_restart')}
          </Button>
          <Button variant="main" className="button-caps" onClick={handleReload} startIcon={<IconRefresh />}>
            {t('trans_refreshPage')}
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default ErrorBoundary;
