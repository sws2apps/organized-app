import useAppTranslation from '@hooks/useAppTranslation';
import { CardSection, CardSectionContent, CardSectionHeader } from './CardSection';
import { Box } from '@mui/material';
import { CustomDivider, TextField } from '@components/index';
import { useState } from 'react';
import { handleNumber } from './utils';
import SwitchItem from './SwitchItem';

const CongregationSection = () => {
  const [circuitNumber, setCircuitNumber] = useState(254);
  const [kingdomHallAddress, setKingdomHallAddress] = useState('');
  const [use24HourFormat, setUse24HourFormat] = useState(true);
  const [startWeekOnSunday, setStartWeekOnSunday] = useState(false);
  const [recordOnlineAttendance, setRecordOnlineAttendance] = useState(false);

  const { t } = useAppTranslation();

  return (
    <CardSection>
      <CardSectionContent>
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <CardSectionHeader
            sx={{ flexGrow: 1 }}
            description={t('tr_congregationSettingsDesc')}
            title="Xanten, 24638"
          />
          <TextField
            sx={{ width: '120px' }}
            type="number"
            label={t('tr_circuitNumber')}
            value={circuitNumber}
            onChange={(e) => handleNumber(e, setCircuitNumber)}
          />
        </Box>
        <TextField
          label={t('tr_kingdomHallAddress')}
          type="text"
          sx={{
            '.MuiFormHelperText-root': {
              color: 'var(--accent-350)',
            },
          }}
          value={kingdomHallAddress}
          onChange={(e) => setKingdomHallAddress(e.target.value)}
          helperText={t('tr_kingdomHallAddressDesc')}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <SwitchItem label={t('tr_24hFormat')} value={use24HourFormat} setValue={setUse24HourFormat} />
          <SwitchItem
            label={t('tr_sundayWeekSetting')}
            helper={t('tr_sundayWeekSettingHelper')}
            value={startWeekOnSunday}
            setValue={setStartWeekOnSunday}
          />
          <SwitchItem
            label={t('tr_recordOnlineAttendance')}
            value={recordOnlineAttendance}
            setValue={setRecordOnlineAttendance}
          />
        </Box>
      </CardSectionContent>
    </CardSection>
  );
};

export default CongregationSection;
