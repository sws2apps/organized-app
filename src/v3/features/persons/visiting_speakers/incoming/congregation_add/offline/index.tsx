import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { CongregationOfflineAddType } from './index.types';
import useOffline from './useOffline';
import CongregationSelector from '@components/congregation_selector';
import TextField from '@components/textfield';
import Typography from '@components/typography';

const CongregationOfflineAdd = ({ onCongregationChange }: CongregationOfflineAddType) => {
  const { t } = useAppTranslation();

  const {
    countryCode,
    isOnline,
    handleSelectCongregation,
    congNumber,
    congCircuitTmp,
    congNameTmp,
    congNumberTmp,
    handleCongCircuitChange,
    handleCongNameChange,
    handleCongNumberChange,
  } = useOffline(onCongregationChange);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Typography color="var(--grey-400)" sx={{ marginBottom: '16px' }}>
        {t('tr_addManualCongregationDesc')}
      </Typography>

      {isOnline && (
        <CongregationSelector
          label={t('tr_searchCongregation')}
          country_code={countryCode}
          setCongregation={handleSelectCongregation}
          cong_number={congNumber}
        />
      )}

      {!isOnline && (
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
