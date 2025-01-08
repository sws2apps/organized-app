import { Box } from '@mui/material';
import { IconError } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import useSignin from './useSignin';
import InfoMessage from '@components/info-message';
import OAuth from '../oauth';
import PageHeader from '@features/app_start/shared/page_header';
import { infoMessageContext } from './context';

const Signin = () => {
  const { t } = useAppTranslation();

  const {
    handleReturnChooser,
    hideMessage,
    message,
    title,
    variant,
    infoMessageData,
    setInfoMessageData,
  } = useSignin();

  return (
    <infoMessageContext.Provider
      value={{ infoMessageData, setInfoMessageData }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <PageHeader
          title={t('tr_login')}
          description={t('tr_signInDesc')}
          onClick={handleReturnChooser}
        />

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <Box>
            <OAuth />
          </Box>

          <Box id="onboarding-error" sx={{ display: 'none' }}>
            <InfoMessage
              variant={variant || infoMessageData?.variant}
              messageIcon={<IconError />}
              messageHeader={title || infoMessageData?.title}
              message={message || infoMessageData?.message}
              onClose={hideMessage}
            />
          </Box>
        </Box>
      </Box>
    </infoMessageContext.Provider>
  );
};

export default Signin;
