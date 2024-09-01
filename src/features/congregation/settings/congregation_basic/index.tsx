import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
} from '../shared_styles';
import useCongregationBasic from './useCongregationBasic';
import MeetingSettings from '../meeting_settings';
import MeetingAttendance from './meeting_attendance';
import SwitchWithLabel from '@components/switch_with_label';
import TextField from '@components/textfield';

const CongregationBasic = () => {
  const { t } = useAppTranslation();

  const { tabletUp } = useBreakpoints();

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
  } = useCongregationBasic();

  return (
    <CardSection>
      <Box
        sx={{
          display: 'flex',
          alignItems: tabletUp ? 'center' : 'unset',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '8px',
          flexDirection: tabletUp ? 'row' : 'column',
        }}
      >
        <CardSectionHeader
          description={t('tr_congregationSettingsDesc')}
          title={congFullName}
          sx={{ flex: 1 }}
        />

        <TextField
          sx={{ width: tabletUp ? '120px' : '100%' }}
          label={t('tr_circuitNumber')}
          value={circuitNumber}
          onChange={(e) => handleCircuitChange(e.target.value)}
          onKeyUp={handleCircuitSave}
        />
      </Box>

      <CardSectionContent>
        <Stack spacing="16px">
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

            <MeetingAttendance />
          </Box>
        </Stack>

        <MeetingSettings />
      </CardSectionContent>
    </CardSection>
  );
};

export default CongregationBasic;
