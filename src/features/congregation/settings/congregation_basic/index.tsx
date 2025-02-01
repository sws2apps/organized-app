import { Box, Stack } from '@mui/material';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
} from '../shared_styles';
import useCongregationBasic from './useCongregationBasic';
import HourFormat from './hour_format';
import MeetingSettings from '../meeting_settings';
import MeetingAttendance from './meeting_attendance';
import TextField from '@components/textfield';

const CongregationBasic = () => {
  const { t } = useAppTranslation();

  const { tabletUp } = useBreakpoints();

  const { isAdmin } = useCurrentUser();

  const {
    congFullName,
    circuitNumber,
    handleCircuitChange,
    handleCircuitSave,
    address,
    handleAddressChange,
    handleAddressSave,
  } = useCongregationBasic();

  return (
    <CardSection
      sx={{
        marginTop: '16px',
      }}
    >
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
          label={t('tr_circuitNumber')}
          value={circuitNumber}
          onChange={(e) => handleCircuitChange(e.target.value)}
          onKeyUp={handleCircuitSave}
          slotProps={{ input: { readOnly: !isAdmin } }}
          sx={{ width: tabletUp ? '160px' : '100%' }}
        />
      </Box>

      <CardSectionContent>
        <Stack spacing="16px">
          <TextField
            label={t('tr_kingdomHallAddress')}
            helperText={t('tr_kingdomHallAddressDesc')}
            value={address}
            onChange={(e) => handleAddressChange(e.target.value)}
            onKeyUp={handleAddressSave}
            slotProps={{ input: { readOnly: !isAdmin } }}
            sx={{
              '.MuiFormHelperText-root': {
                color: 'var(--accent-350) !important',
              },
            }}
          />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <HourFormat />

            <MeetingAttendance />
          </Box>
        </Stack>

        <MeetingSettings />
      </CardSectionContent>
    </CardSection>
  );
};

export default CongregationBasic;
