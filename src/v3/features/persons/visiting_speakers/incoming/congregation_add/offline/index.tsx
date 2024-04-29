import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { CongregationOfflineAddType } from './index.types';
import useOffline from './useOffline';
import CongregationSelector from '@components/congregation_selector';
import Typography from '@components/typography';

const CongregationOfflineAdd = ({ onCongregationChange }: CongregationOfflineAddType) => {
  const { t } = useAppTranslation();

  const { countryCode, isOnline, handleSelectCongregation, congNumber } = useOffline(onCongregationChange);

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
    </Box>
  );
};

export default CongregationOfflineAdd;
