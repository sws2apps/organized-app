import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { TwoColumnsRow } from '../../shared_styles/components';
import useWeekendSettings from './useWeekend';
import DaySelector from '@components/day_selector';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import SwitchWithLabel from '@components/switch_with_label';
import TimePicker from '@components/time_picker';
import Typography from '@components/typography';

const WeekendSettings = () => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const {
    autoAssignOpeningPrayer,
    handleAutoOpeningPrayerToggle,
    handleMeetingDayChange,
    handleMeetingTimeChange,
    handleMonthlyOverlapToggle,
    handleSubstituteSpeakerToggle,
    handleWTConductorMainPersonChange,
    handleWTConductorToggle,
    hour24,
    meetingDay,
    meetingTime,
    monthlyOverlapShown,
    personsWTCondcutorList,
    substituteSpeakerEnabled,
    subtituteWTConductorDisplayed,
    wtConductorMainPerson,
  } = useWeekendSettings();

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
          label={t('tr_appointSubsisuteSpeaker')}
          checked={substituteSpeakerEnabled}
          onChange={handleSubstituteSpeakerToggle}
        />

        <TwoColumnsRow
          sx={{
            flexDirection: laptopUp ? 'row' : 'column',
            alignItems: laptopUp ? 'center' : 'unset',
          }}
        >
          <SwitchWithLabel
            label={t('tr_displayWSConductorSubstitutions')}
            helper={t('tr_displayWSConductorDesc')}
            checked={subtituteWTConductorDisplayed}
            onChange={handleWTConductorToggle}
          />

          <Select
            label={t('tr_mainStudyConductor')}
            value={wtConductorMainPerson}
            onChange={(e) => handleWTConductorMainPersonChange(e.target.value)}
          >
            {personsWTCondcutorList.map((person) => (
              <MenuItem key={person.value} value={person.value}>
                <Typography>{person.label}</Typography>
              </MenuItem>
            ))}
          </Select>
        </TwoColumnsRow>

        <SwitchWithLabel
          label={t('tr_repeatedMonthlyWarning')}
          helper={t('tr_repeatedMonthlyWarningDesc')}
          checked={monthlyOverlapShown}
          onChange={handleMonthlyOverlapToggle}
        />
      </Box>
    </Box>
  );
};

export default WeekendSettings;
