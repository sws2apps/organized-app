import { Badge, Box, Stack } from '@mui/material';
import { IconError } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useVerifyMFA from './useVerifyMFA';
import InfoMessage from '@components/info-message';
import OTPInput from '@components/otp_input';
import PageHeader from '@features/app_start/shared/page_header';
import Typography from '@components/typography';

const VerifyMFA = () => {
  const { t } = useAppTranslation();

  const {
    hideMessage,
    message,
    title,
    variant,
    code,
    handleCodeChange,
    hasError,
    handleGoBack,
    tokenDev,
  } = useVerifyMFA();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <PageHeader
        title={t('tr_mfaVerifyTitle')}
        description={t('tr_mfaVerifyDesc')}
        onClick={handleGoBack}
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
        <Stack spacing="24px">
          <OTPInput
            value={code}
            onChange={handleCodeChange}
            hasError={hasError}
          />

          {tokenDev?.length > 0 && (
            <Box sx={{ display: 'flex', gap: '20px' }}>
              <Badge badgeContent={'dev'} color="error" />
              <Box>
                <Typography>Enter this code to continue: {tokenDev}</Typography>
              </Box>
            </Box>
          )}
        </Stack>

        <Box id="onboarding-error" sx={{ display: 'none' }}>
          <InfoMessage
            variant={variant}
            messageIcon={<IconError />}
            messageHeader={title}
            message={message}
            onClose={hideMessage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default VerifyMFA;
