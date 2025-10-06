import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { CongregationOfflineAddType } from './index.types';
import useOffline from './useOffline';
import CongregationSelector from '@components/congregation_selector';
import CountrySelector from '@components/country_selector';
import TextField from '@components/textfield';
import Typography from '@components/typography';

const CongregationOfflineAdd = ({
  onCongregationChange,
}: CongregationOfflineAddType) => {
  const { t } = useAppTranslation();

  const {
    country,
    handleSelectCongregation,
    congCircuitTmp,
    congNameTmp,
    congNumberTmp,
    handleCongCircuitChange,
    handleCongNameChange,
    handleCongNumberChange,
    handleCountryChange,
    handleCongSearchOverride,
    showOnlineInput,
    congName,
  } = useOffline(onCongregationChange);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Typography color="var(--grey-400)" sx={{ marginBottom: '16px' }}>
        {t('tr_addManualCongregationDesc')}
      </Typography>

      {showOnlineInput && (
        <>
          <CountrySelector
            value={country}
            handleCountryChange={handleCountryChange}
          />

          {country !== null && (
            <CongregationSelector
              freeSolo={true}
              label={t('tr_searchCongregation')}
              country_guid={country.countryGuid}
              cong_name={congName}
              setCongregation={handleSelectCongregation}
              freeSoloChange={handleCongSearchOverride}
            />
          )}
        </>
      )}

      {!showOnlineInput && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField
            label={t('tr_congregationName')}
            value={congNameTmp}
            onChange={(e) => handleCongNameChange(e.target.value)}
          />

          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <TextField
              label={t('tr_number')}
              value={congNumberTmp}
              onChange={(e) => handleCongNumberChange(e.target.value)}
            />
            <TextField
              label={t('tr_circuitNumber')}
              value={congCircuitTmp}
              onChange={(e) => handleCongCircuitChange(e.target.value)}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CongregationOfflineAdd;
