import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { TwoColumnsRow } from '../../shared_styles/components';
import useMidweekSettings from './useMidweek';
import DaySelector from '@components/day_selector';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import SwitchWithLabel from '@components/switch_with_label';
import TimePicker from '@components/time_picker';
import Typography from '@components/typography';

const MidweekSettings = () => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const {
    meetingDay,
    handleMeetingDayChange,
    hour24,
    meetingTime,
    handleMeetingTimeChange,
    autoAssignOpeningPrayer,
    handleAutoOpeningPrayerToggle,
    autoAssignClosingPrayer,
    handleAutoClosingPrayerToggle,
    auxClassEnabled,
    handleAuxClassToggle,
    auxCounselorMainEnabled,
    handleAuxCounselorMainToggle,
    personsAuxCounselorList,
    auxCounselorMainPerson,
    handleAuxCounselorMainPersonChange,
  } = useMidweekSettings();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <TwoColumnsRow>
        <DaySelector
          label={t('tr_meetingDay')}
          value={meetingDay}
          onChange={handleMeetingDayChange}
        />

        <TimePicker
          label={t('tr_timerLabelTime')}
          ampm={!hour24}
          value={meetingTime}
          onChange={(time) => handleMeetingTimeChange(time)}
        />
      </TwoColumnsRow>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <SwitchWithLabel
          label={t('tr_autoAssignOpeningPrayer')}
          checked={autoAssignOpeningPrayer}
          onChange={handleAutoOpeningPrayerToggle}
        />

        <SwitchWithLabel
          label={t('tr_autoAssignClosingPrayer')}
          checked={autoAssignClosingPrayer}
          onChange={handleAutoClosingPrayerToggle}
        />

        <SwitchWithLabel
          label={t('tr_auxClassroom')}
          checked={auxClassEnabled}
          onChange={handleAuxClassToggle}
        />

        {auxClassEnabled && (
          <TwoColumnsRow
            sx={{
              flexDirection: laptopUp ? 'row' : 'column',
              alignItems: laptopUp ? 'center' : 'unset',
            }}
          >
            <SwitchWithLabel
              label={t('tr_assignAuxCounselor')}
              helper={t('tr_assignAuxCounserlorDesc')}
              checked={auxCounselorMainEnabled}
              onChange={handleAuxCounselorMainToggle}
            />

            <Select
              label={t('tr_auxClassCounselor')}
              value={auxCounselorMainPerson}
              onChange={(e) =>
                handleAuxCounselorMainPersonChange(e.target.value)
              }
            >
              {personsAuxCounselorList.map((person) => (
                <MenuItem key={person.value} value={person.value}>
                  <Typography>{person.label}</Typography>
                </MenuItem>
              ))}
            </Select>
          </TwoColumnsRow>
        )}
      </Box>
    </Box>
  );
};

export default MidweekSettings;
