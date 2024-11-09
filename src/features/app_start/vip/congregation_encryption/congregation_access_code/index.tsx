import { Box } from '@mui/material';
import { IconEncryptionKey, IconError, IconLoading } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import useCongregationAccessCode from './useCongregationAccessCode';
import PageHeader from '@features/app_start/shared/page_header';
import Button from '@components/button';
import InfoMessage from '@components/info-message';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import WaitingLoader from '@components/waiting_loader';
import Criteria from './criteria';
import VipInfoTip from '@features/app_start/vip/vip_info_tip';

const CongregationAccessCode = () => {
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
    setTmpAccessCode,
    setTmpAccessCodeVerify,
    tmpAccessCode,
    tmpAccessCodeVerify,
    btnActionDisabled,
  } = useCongregationAccessCode();

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
      {isLoading && <WaitingLoader variant="standard" />}
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
              description={t(
                isSetupCode
                  ? 'tr_congregationAccessCodeCreateDesc'
                  : 'tr_congregationAccessCodeLostDesc'
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
                  {t('tr_congregationAccessCodeNotice')}
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
                      ? 'tr_congregationAccessCodeCreate'
                      : 'tr_congregationAccessCodeAsk'
                  )}
                  variant="outlined"
                  autoComplete="off"
                  value={tmpAccessCode}
                  onChange={(e) => setTmpAccessCode(e.target.value)}
                  startIcon={<IconEncryptionKey />}
                  resetHelperPadding={true}
                />
                {isSetupCode && (
                  <TextField
                    type="password"
                    label={t('tr_congregationAccessCodeVerify')}
                    variant="outlined"
                    autoComplete="off"
                    value={tmpAccessCodeVerify}
                    onChange={(e) => setTmpAccessCodeVerify(e.target.value)}
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
                            criteria={t(
                              'tr_congregationAccessCodeNoticeLength'
                            )}
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
                    ? 'tr_congregationAccessCodeSet'
                    : 'tr_encryptionCodeValidate'
                )}
              </Button>
            </Box>
          </Box>

          <VipInfoTip variant="congregationCodes" />

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
