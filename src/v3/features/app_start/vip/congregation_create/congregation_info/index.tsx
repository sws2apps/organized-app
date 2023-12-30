import { Box } from '@mui/material';
import { Button, CongregationSelector, CountrySelector, InfoMessage, TextField } from '@components';
import { PageHeader } from '@features/app_start';
import { IconAccount, IconError, IconLoading } from '@icons';
import { useAppTranslation } from '@hooks/index';
import useCongregationInfo from './useCongregationInfo';

const CongregationInfo = ({ setIsCreate }: { setIsCreate: (value: boolean) => void }) => {
  const { t } = useAppTranslation();

  const {
    country,
    handleCongregationAction,
    setCongregation,
    setCountry,
    isProcessing,
    title,
    message,
    hideMessage,
    variant,
    setUserTmpFirstName,
    setUserTmpLastName,
    userTmpFirstName,
    userTmpLastName,
  } = useCongregationInfo();

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
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
        <PageHeader title={t('trans_createCongregationAccount')} onClick={() => setIsCreate(false)} />

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
              gap: '16px',
              alignItems: 'center',
              width: '100%',
              flexWrap: 'wrap',
            }}
          >
            <TextField
              label={t('trans_firstname')}
              variant="outlined"
              autoComplete="off"
              required={true}
              value={userTmpFirstName}
              onChange={(e) => setUserTmpFirstName(e.target.value)}
              sx={{ flex: '1 0 200px' }}
              startIcon={<IconAccount />}
            />
            <TextField
              label={t('trans_lastname')}
              variant="outlined"
              autoComplete="off"
              value={userTmpLastName}
              onChange={(e) => setUserTmpLastName(e.target.value)}
              sx={{ flex: '1 0 200px' }}
            />
          </Box>

          <CountrySelector handleCountryChange={setCountry} />
          {country !== null && <CongregationSelector country={country} setCongregation={setCongregation} />}

          <Button
            variant="main"
            onClick={handleCongregationAction}
            sx={{ width: '100%' }}
            startIcon={isProcessing ? <IconLoading width={22} height={22} /> : null}
          >
            {t('trans_createCongregation')}
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

export default CongregationInfo;
