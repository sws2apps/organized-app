import { Box } from '@mui/material';
import PageHeader from '@features/app_start/shared/page_header';
import Button from '@components/button';
import InfoMessage from '@components/info-message';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import WaitingCircular from '@components/waiting_circular';
import Criteria from './criteria';
import { IconEncryptionKey, IconError, IconLoading } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import useCongregationMasterKey from './useCongregationMasterKey';

const CongregationEncryption = () => {
  const { t } = useAppTranslation();

  const {
    isLoading,
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
    isMatch,
    setTmpMasterKey,
    setTmpMasterKeyVerify,
    tmpMasterKey,
    tmpMasterKeyVerify,
    btnActionDisabled,
  } = useCongregationMasterKey();

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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              width: '100%',
            }}
          >
            <PageHeader
              title={t('tr_congregationMasterKey')}
              description={t(
                isSetupCode
                  ? 'tr_createMasterKeyIntroDesc'
                  : 'tr_congregationMasterKeyLostDesc'
              )}
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
                  {t('tr_encryptionCodeNotice')}
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
                  label={t(
                    isSetupCode
                      ? 'tr_createCongregationMasterKey'
                      : 'tr_congregationMasterKeyAsk'
                  )}
                  variant="outlined"
                  autoComplete="off"
                  value={tmpMasterKey}
                  onChange={(e) => setTmpMasterKey(e.target.value)}
                  startIcon={<IconEncryptionKey />}
                  resetHelperPadding={true}
                />
                {isSetupCode && (
                  <TextField
                    type="password"
                    label={t('tr_congregationMasterKeyVerify')}
                    variant="outlined"
                    autoComplete="off"
                    value={tmpMasterKeyVerify}
                    onChange={(e) => setTmpMasterKeyVerify(e.target.value)}
                    startIcon={<IconEncryptionKey />}
                    resetHelperPadding={true}
                    helperText={
                      isSetupCode ? (
                        <Box
                          sx={{
                            padding: '8px 0px 0px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                          }}
                        >
                          <Criteria
                            criteria={t('tr_encryptionCodeNoticeLength')}
                            passed={isLengthPassed}
                          />
                          <Criteria
                            criteria={t('tr_encryptionCodeNoticeNumber')}
                            passed={isNumberPassed}
                          />
                          <Criteria
                            criteria={t('tr_encryptionCodeNoticeLowerCase')}
                            passed={isLowerCasePassed}
                          />
                          <Criteria
                            criteria={t('tr_encryptionCodeNoticeUpperCase')}
                            passed={isUpperCasePassed}
                          />
                          <Criteria
                            criteria={t('tr_encryptionCodeNoticeSpecialSymbol')}
                            passed={isSpecialSymbolPassed}
                          />
                          <Criteria
                            criteria={t('tr_encryptionCodeNoticeMatch')}
                            passed={isMatch}
                          />
                        </Box>
                      ) : null
                    }
                  />
                )}
              </Box>

              <Button
                variant="main"
                sx={{ width: '100%' }}
                onClick={handleAction}
                startIcon={
                  isProcessing ? <IconLoading width={22} height={22} /> : null
                }
                disabled={btnActionDisabled}
              >
                {t(
                  isSetupCode
                    ? 'tr_encryptionCodeSet'
                    : 'tr_encryptionCodeValidate'
                )}
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
