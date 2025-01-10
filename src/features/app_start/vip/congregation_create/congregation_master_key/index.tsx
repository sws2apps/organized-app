import { Box } from '@mui/material';
import { IconEncryptionKey, IconError } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import useCongregationMasterKey from './useCongregationMasterKey';
import Button from '@components/button';
import Criteria from './criteria';
import InfoMessage from '@components/info-message';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import Markup from '@components/text_markup';
import WaitingLoader from '@components/waiting_loader';

const CongregationMasterKey = () => {
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
    setTmpMasterKey,
    setTmpMasterKeyVerify,
    tmpMasterKey,
    tmpMasterKeyVerify,
    btnActionDisabled,
    handleSetMasterKey,
  } = useCongregationMasterKey();

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
          content={t('tr_createMasterKeyDesc')}
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
            background: 'var(--red-secondary)',
            marginBottom: '32px',
          }}
        >
          <IconError color="var(--red-main)" />
          <Typography className="body-small-regular" color="var(--red-main)">
            {t('tr_encryptionCodeNotice')}
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
              label={t('tr_createCongregationMasterKey')}
              variant="outlined"
              autoComplete="off"
              value={tmpMasterKey}
              onChange={(e) => setTmpMasterKey(e.target.value)}
              startIcon={<IconEncryptionKey />}
              resetHelperPadding={true}
            />
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
              }
            />
          </Box>

          <Button
            variant="main"
            sx={{ width: '100%' }}
            onClick={handleSetMasterKey}
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
            {t('tr_encryptionCodeSet')}
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
    </Box>
  );
};

export default CongregationMasterKey;
