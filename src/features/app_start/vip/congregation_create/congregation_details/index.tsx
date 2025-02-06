import { Box } from '@mui/material';
import { IconAccount, IconError } from '@icons/index';
import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import useCongregationDetails from './useCongregationDetails';
import Button from '@components/button';
import Checkbox from '@components/checkbox';
import CongregationSelector from '@components/congregation_selector';
import CountrySelector from '@components/country_selector';
import InfoMessage from '@components/info-message';
import TextField from '@components/textfield';
import VipInfoTip from '@features/app_start/vip/vip_info_tip';

const CongregationDetails = () => {
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
    handleToggleApproval,
    isElderApproved,
    congregation,
  } = useCongregationDetails();

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
              label={t('tr_firstname')}
              variant="outlined"
              autoComplete="off"
              required={true}
              value={userTmpFirstName}
              onChange={(e) => setUserTmpFirstName(e.target.value)}
              sx={{ flex: '1 0 200px' }}
              startIcon={<IconAccount />}
            />
            <TextField
              label={t('tr_lastname')}
              variant="outlined"
              autoComplete="off"
              value={userTmpLastName}
              onChange={(e) => setUserTmpLastName(e.target.value)}
              sx={{ flex: '1 0 200px' }}
            />
          </Box>

          <CountrySelector handleCountryChange={setCountry} />
          {country !== null && (
            <CongregationSelector
              country_code={country.code}
              setCongregation={setCongregation}
            />
          )}

          <Checkbox
            label={t('tr_registeringApproved')}
            disabled={congregation === null}
            checked={isElderApproved}
            onChange={(e) => handleToggleApproval(e.target.checked)}
          />

          <Button
            variant="main"
            disabled={!isElderApproved}
            onClick={handleCongregationAction}
            sx={{ width: '100%' }}
            startIcon={
              isProcessing ? <IconLoading width={22} height={22} /> : null
            }
          >
            {t('tr_createCongregation')}
          </Button>
        </Box>
      </Box>

      <VipInfoTip variant="congregationSearch" />

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

export default CongregationDetails;
