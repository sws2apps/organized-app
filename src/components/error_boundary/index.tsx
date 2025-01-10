import { Box, Container } from '@mui/material';
import { NavBar } from '@layouts/index';
import { IconRefresh, IconRestart } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import useError from './useError';
import Button from '@components/button';
import Typography from '@components/typography';
import { getMessageByCode } from '@services/i18n/translation';

/**
 * Error boundary component to handle errors gracefully.
 *
 * @returns {JSX.Element} ErrorBoundary component.
 */
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
          padding: {
            mobile: '16px',
            tablet: '24px',
            display: 'flex',
            flexDirection: 'column',
          },
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Typography className="h1" color="var(--black)">
          {getMessageByCode('error_app_generic-title')}
        </Typography>
        <Typography color="var(--grey-400)">
          {error.message || error.data}
        </Typography>
        <Typography className="body-regular" color="var(--grey-400)">
          {getMessageByCode('error_app_generic-desc')}
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
            {t('tr_restart')}
          </Button>
          <Button
            variant="main"
            className="button-caps"
            onClick={handleReload}
            startIcon={<IconRefresh />}
          >
            {t('tr_refreshPage')}
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default ErrorBoundary;
