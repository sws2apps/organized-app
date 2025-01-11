import { Box } from '@mui/material';
import { IconCongregationAccess, IconError, IconLoading } from '@icons/index';
import { useAppTranslation, useKeydownHandler } from '@hooks/index';
import useCongregationAccessCode from './useCongregationAccessCode';
import Button from '@components/button';
import Criteria from './criteria';
import InfoMessage from '@components/info-message';
import Markup from '@components/text_markup';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import VipInfoTip from '@features/app_start/vip/vip_info_tip';

const CongregationAccessCode = () => {
  const { t } = useAppTranslation();

  const {
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
    isMatch,
    setTmpAccessCode,
    setTmpAccessCodeVerify,
    tmpAccessCode,
    tmpAccessCodeVerify,
    btnActionDisabled,
    handleSetAccessCode,
  } = useCongregationAccessCode();

  const { registerKeydownHandler } = useKeydownHandler();

  // TODO: Add steps for enter passwords | 1 password  > check password > click button
  registerKeydownHandler('Enter', handleSetAccessCode);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        gap: '24px',
        flexGrow: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
        }}
      >
        <Markup
          content={t('tr_createAccessCodeDesc')}
          className="body-regular"
          color="var(--grey-400)"
          style={{ marginBottom: '24px' }}
        />

        <Box
          sx={{
            display: 'flex',
            padding: '8px 16px',
            alignItems: 'center',
            gap: '8px',
            borderRadius: 'var(--radius-l)',
            background: 'var(--orange-secondary)',
            marginBottom: '32px',
          }}
        >
          <IconError color="var(--orange-dark)" />
          <Typography className="body-small-regular" color="var(--orange-dark)">
            {t('tr_congregationAccessCodeNotice')}
          </Typography>
        </Box>

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
              label={t('tr_congregationAccessCodeCreate')}
              variant="outlined"
              autoComplete="off"
              value={tmpAccessCode}
              onChange={(e) => setTmpAccessCode(e.target.value)}
              startIcon={<IconCongregationAccess />}
              resetHelperPadding={true}
            />
            <TextField
              type="password"
              label={t('tr_congregationAccessCodeVerify')}
              variant="outlined"
              autoComplete="off"
              value={tmpAccessCodeVerify}
              onChange={(e) => setTmpAccessCodeVerify(e.target.value)}
              startIcon={<IconCongregationAccess />}
              resetHelperPadding={true}
              helperText={
                <Box
                  sx={{
                    padding: '8px 0px 0px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <Criteria
                    criteria={t('tr_congregationAccessCodeNoticeLength')}
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
              }
            />
          </Box>

          <Button
            variant="main"
            sx={{ width: '100%' }}
            onClick={handleSetAccessCode}
            startIcon={
              isProcessing ? <IconLoading width={22} height={22} /> : null
            }
            disabled={btnActionDisabled}
          >
            {t('tr_congregationAccessCodeSet')}
          </Button>
        </Box>
      </Box>

      <Box>
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
      </Box>
    </Box>
  );
};

export default CongregationAccessCode;
