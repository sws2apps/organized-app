import { Box, Stack, useMediaQuery } from '@mui/material';
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
  const fieldsWide = useMediaQuery('(min-width: 550px)');

  const { isAdmin, isGroup } = useCurrentUser();

  const {
    congName,
    circuitNumber,
    handleCircuitChange,
    handleCircuitSave,
    address,
    handleAddressChange,
    handleAddressSave,
    handleNumberChange,
    handleNumberSave,
    congNumber,
  } = useCongregationBasic();

  return (
    <CardSection>
      <Box
        sx={{
          display: 'flex',
          alignItems: tabletUp ? 'flex-start' : 'unset',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '8px',
          flexDirection: tabletUp ? 'row' : 'column',
        }}
      >
        <CardSectionHeader
          description={!isGroup && t('tr_congregationSettingsDesc')}
          title={isGroup ? t('tr_groupSettings') : congName}
          sx={{ flex: 1 }}
        />

        {!isGroup && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '12px',
              width: fieldsWide ? 'auto' : '100%',
            }}
          >
            <TextField
              label={t('tr_number')}
              value={congNumber}
              onChange={(e) => handleNumberChange(e.target.value)}
              onKeyUp={handleNumberSave}
              slotProps={{ input: { readOnly: !isAdmin } }}
              sx={{ flex: 1, maxWidth: fieldsWide ? '140px' : 'none' }}
            />
            <TextField
              label={t('tr_circuitNumber')}
              value={circuitNumber}
              onChange={(e) => handleCircuitChange(e.target.value)}
              onKeyUp={handleCircuitSave}
              slotProps={{ input: { readOnly: !isAdmin } }}
              sx={{ flex: 1, maxWidth: fieldsWide ? '140px' : 'none' }}
            />
          </Box>
        )}
      </Box>

      <CardSectionContent>
        <Stack spacing="16px">
          {!isGroup && (
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
          )}

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
