import { Box } from '@mui/material';
import { IconCongregationAccess, IconError } from '@icons/index';
import { useAppTranslation, useKeydownHandler } from '@hooks/index';
import useCongregationAccessCode from './useCongregationAccessCode';
import PageHeader from '@features/app_start/shared/page_header';
import Button from '@components/button';
import InfoMessage from '@components/info-message';
import TextField from '@components/textfield';
import WaitingLoader from '@components/waiting_loader';

const CongregationAccessCode = () => {
  const { t } = useAppTranslation();

  const {
    isLoading,
    isProcessing,
    hideMessage,
    message,
    title,
    variant,
    setTmpAccessCode,
    tmpAccessCode,
    btnActionDisabled,
    handleValidateAccessCode,
  } = useCongregationAccessCode();

  const { registerKeydownHandler } = useKeydownHandler();

  registerKeydownHandler('Enter', handleValidateAccessCode);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%',
        gap: '24px',
      }}
    >
      {isLoading && <WaitingLoader type="lottie" variant="standard" />}
      {!isLoading && (
        <>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              width: '100%',
            }}
          >
            <PageHeader
              title={t('tr_congregationAccessCode')}
              description={t('tr_congregationAccessCodeLostDesc')}
            />

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                alignItems: 'flex-start',
                alignSelf: 'stretch',
                width: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  width: '100%',
                }}
              >
                <TextField
                  type="password"
                  label={t('tr_congregationAccessCodeAsk')}
                  variant="outlined"
                  autoComplete="off"
                  value={tmpAccessCode}
                  onChange={(e) => setTmpAccessCode(e.target.value)}
                  startIcon={<IconCongregationAccess />}
                  resetHelperPadding={true}
                />
              </Box>

              <Button
                variant="main"
                sx={{ width: '100%' }}
                onClick={handleValidateAccessCode}
                startIcon={
                  isProcessing ? (
                    <WaitingLoader
                      size={22}
                      color="var(--black)"
                      variant="standard"
                    />
                  ) : null
                }
                disabled={btnActionDisabled}
              >
                {t('tr_encryptionCodeValidate')}
              </Button>
            </Box>
          </Box>

          <Box id="onboarding-error" sx={{ display: 'none' }}>
            <InfoMessage
              variant={variant}
              messageIcon={<IconError />}
              messageHeader={title}
              message={message}
              onClose={hideMessage}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default CongregationAccessCode;
