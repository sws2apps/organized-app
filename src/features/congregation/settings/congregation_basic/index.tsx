import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
} from '../../shared_styles/components';
import useCongregationBasic from './useCongregationBasic';
import MeettingSettings from '../meeting_settings';
import SwitchWithLabel from '@components/switch_with_label';
import TextField from '@components/textfield';

const CongregationBasic = () => {
  const { t } = useAppTranslation();

  const {
    congFullName,
    circuitNumber,
    handleCircuitChange,
    handleCircuitSave,
    address,
    handleAddressChange,
    handleAddressSave,
    hour24,
    handleHour24Toggle,
    recordOnline,
    handleRecordOnlineToggle,
  } = useCongregationBasic();

  return (
    <CardSection>
      <CardSectionContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <CardSectionHeader
            sx={{ flexGrow: 1 }}
            description={t('tr_congregationSettingsDesc')}
            title={congFullName}
          />

          <TextField
            sx={{ width: '120px' }}
            label={t('tr_circuitNumber')}
            value={circuitNumber}
            onChange={(e) => handleCircuitChange(e.target.value)}
            onKeyUp={handleCircuitSave}
          />
        </Box>

        <TextField
          label={t('tr_kingdomHallAddress')}
          sx={{
            '.MuiFormHelperText-root': {
              color: 'var(--accent-350) !important',
            },
          }}
          helperText={t('tr_kingdomHallAddressDesc')}
          value={address}
          onChange={(e) => handleAddressChange(e.target.value)}
          onKeyUp={handleAddressSave}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <SwitchWithLabel
            label={t('tr_24hFormat')}
            checked={hour24}
            onChange={handleHour24Toggle}
          />

          <SwitchWithLabel
            label={t('tr_recordOnlineAttendance')}
            helper={t('tr_recordOnlineAttendanceDesc')}
            checked={recordOnline}
            onChange={handleRecordOnlineToggle}
          />
        </Box>
      </CardSectionContent>

      <MeettingSettings />
    </CardSection>
  );
};

export default CongregationBasic;
