import { Box } from '@mui/material';
import { PageHeader } from '@features/app_start';
import { Button, InfoMessage, TextField, Typography, WaitingCircular } from '@components';
import Criteria from './components/Criteria';
import { IconEncryptionKey, IconError, IconLoading } from '@icons';
import { useAppTranslation } from '@hooks/index';
import useCongregationEncryption from './useCongregationEncryption';

const CongregationEncryption = () => {
  const { t } = useAppTranslation();

  const {
    isLoading,
    tmpEncryptionCode,
    setTmpEncryptionCode,
    isLengthPassed,
    isNumberPassed,
    isLowerCasePassed,
    isUpperCasePassed,
    isSpecialSymbolPassed,
    isProcessing,
    hideMessage,
    message,
    title,
    variant,
    handleAction,
    isSetupCode,
  } = useCongregationEncryption();

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
      {isLoading && <WaitingCircular variant="standard" />}
      {!isLoading && (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
            <PageHeader
              title={t('trans_encryptionCode')}
              description={t(isSetupCode ? 'trans_encryptionCodeSetupDesc' : 'trans_encryptionCodeLostDesc')}
            />

            {isSetupCode && (
              <Box
                sx={{
                  display: 'flex',
                  padding: '8px 16px',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: 'var(--radius-l)',
                  background: 'var(--red-secondary)',
                  marginBottom: '32px',
                }}
              >
                <IconError color="var(--red-main)" />
                <Typography className="body-regular" color="var(--red-main)">
                  {t('trans_encryptionCodeNotice')}
                </Typography>
              </Box>
            )}

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
              <TextField
                label={t(isSetupCode ? 'trans_encryptionCodeCreate' : 'trans_encryptionCodeAsk')}
                variant="outlined"
                autoComplete="off"
                value={tmpEncryptionCode}
                onChange={(e) => setTmpEncryptionCode(e.target.value)}
                startIcon={<IconEncryptionKey />}
                resetHelperPadding={true}
                helperText={
                  isSetupCode ? (
                    <Box sx={{ padding: '8px 0px 0px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <Criteria criteria={t('trans_encryptionCodeNoticeLength')} passed={isLengthPassed} />
                      <Criteria criteria={t('trans_encryptionCodeNoticeNumber')} passed={isNumberPassed} />
                      <Criteria criteria={t('trans_encryptionCodeNoticeLowerCase')} passed={isLowerCasePassed} />
                      <Criteria criteria={t('trans_encryptionCodeNoticeUpperCase')} passed={isUpperCasePassed} />
                      <Criteria
                        criteria={t('trans_encryptionCodeNoticeSpecialSymbol')}
                        passed={isSpecialSymbolPassed}
                      />
                    </Box>
                  ) : null
                }
              />

              <Button
                variant="main"
                sx={{ width: '100%' }}
                onClick={handleAction}
                startIcon={isProcessing ? <IconLoading width={22} height={22} /> : null}
                disabled={
                  !isLengthPassed ||
                  !isNumberPassed ||
                  !isLowerCasePassed ||
                  !isUpperCasePassed ||
                  !isSpecialSymbolPassed
                }
              >
                {t(isSetupCode ? 'trans_encryptionCodeSet' : 'trans_encryptionCodeValidate')}
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

export default CongregationEncryption;
