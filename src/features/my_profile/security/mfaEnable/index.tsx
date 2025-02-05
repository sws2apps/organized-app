import { Badge, Box, IconButton } from '@mui/material';
import { IconCopy } from '@components/icons';
import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import useMFAEnable from './useMFAEnable';
import Button from '@components/button';
import Dialog from '@components/dialog';
import OTPInput from '@components/otp_input';
import Tabs from '@components/tabs';
import TextField from '@components/textfield';
import Typography from '@components/typography';

type MFAEnableType = {
  open: boolean;
  onClose: VoidFunction;
};

const MFAEnable = ({ open, onClose }: MFAEnableType) => {
  const { t } = useAppTranslation();

  const {
    isLoading,
    qrCode,
    token,
    handleCopyTokenClipboard,
    handleOtpChange,
    userOTP,
    handleVerifyOTP,
    isProcessing,
    imgSrc,
    codeError,
    tokenDev,
  } = useMFAEnable(onClose);

  return (
    <Dialog onClose={onClose} open={open}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%',
        }}
      >
        <Typography className="h2">{t('tr_2FAStep1')}</Typography>
        {isLoading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              padding: '36px',
              width: '100%',
            }}
          >
            <IconLoading color="var(--accent-main)" width={84} height={84} />
          </Box>
        )}
        {!isLoading && (
          <Typography className="body-regular" color="var(--grey-400)">
            {t('tr_2FAStep1Desc')}
          </Typography>
        )}
      </Box>
      {!isLoading && (
        <>
          <Box sx={{ borderBottom: '1px solid var(--accent-200)' }}>
            <Tabs
              tabs={[
                {
                  label: t('tr_2FAQuickSetup'),
                  Component: (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                      }}
                    >
                      <Typography
                        className="body-regular"
                        color="var(--grey-400)"
                      >
                        {t('tr_2FAQuickSetupDesc')}
                      </Typography>
                      <Button variant="tertiary" rel="noopener" href={qrCode}>
                        {t('tr_setup')}
                      </Button>
                    </Box>
                  ),
                },
                {
                  label: t('tr_2FAQRCode'),
                  Component: (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                      }}
                    >
                      <Typography
                        className="body-regular"
                        color="var(--grey-400)"
                      >
                        {t('tr_2FAQRCodeDesc')}
                      </Typography>

                      <img
                        className="qrcode"
                        src={imgSrc}
                        alt="QR Code 2FA"
                        style={{ alignSelf: 'center' }}
                      />
                    </Box>
                  ),
                },
                {
                  label: t('tr_2FASetupKey'),
                  Component: (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                      }}
                    >
                      <Typography
                        className="body-regular"
                        color="var(--grey-400)"
                      >
                        {t('tr_2FASetupKeyDesc')}
                      </Typography>

                      <TextField
                        label={t('tr_2FASetupKey')}
                        value={token}
                        slotProps={{ input: { readOnly: true } }}
                        endIcon={
                          <IconButton
                            sx={{ padding: 0 }}
                            onClick={handleCopyTokenClipboard}
                          >
                            <IconCopy color="var(--accent-400)" />
                          </IconButton>
                        }
                      />
                    </Box>
                  ),
                },
              ]}
            />
          </Box>

          <Typography className="h2">{t('tr_2FAStep2')}</Typography>

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexDirection: 'column',
            }}
          >
            <OTPInput
              value={userOTP}
              onChange={handleOtpChange}
              hasError={codeError}
            />
            {codeError && (
              <Typography
                className="body-small-regular"
                color="var(--red-dark)"
              >
                {t('tr_2FATokenInvalidExpired')}
              </Typography>
            )}
          </Box>

          {tokenDev && (
            <Box sx={{ display: 'flex', gap: '20px', marginLeft: '20px' }}>
              <Badge badgeContent={'dev'} color="error" />
              <Box>
                <Typography>Enter this code to continue: {tokenDev}</Typography>
              </Box>
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: '100%',
            }}
          >
            <Button
              variant="main"
              disabled={userOTP.length < 6}
              onClick={handleVerifyOTP}
              endIcon={
                isProcessing ? (
                  <IconLoading width={22} height={22} color="var(--black)" />
                ) : undefined
              }
            >
              {t('tr_verify')}
            </Button>
            <Button variant="secondary" onClick={onClose}>
              {t('tr_cancel')}
            </Button>
          </Box>
        </>
      )}
    </Dialog>
  );
};

export default MFAEnable;
