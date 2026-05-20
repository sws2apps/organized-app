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
import TextField from '@components/textfield';
import DeleteCongregation from '../congregation_privacy/delete_congregation';

const CongregationBasic = () => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();
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
    <Stack spacing="16px">
      <CardSection>
        <Box
          sx={{
            display: 'flex',
            alignItems: laptopUp ? 'flex-start' : 'unset',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '8px',
            flexDirection: laptopUp ? 'row' : 'column',
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

        <CardSectionContent sx={{ '& > hr': { display: 'none' } }}>
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
            </Box>
          </Stack>
        </CardSectionContent>
      </CardSection>


      {isAdmin && !isGroup && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '8px' }}>
          <DeleteCongregation />
        </Box>
      )}
    </Stack>
  );
};

export default CongregationBasic;
