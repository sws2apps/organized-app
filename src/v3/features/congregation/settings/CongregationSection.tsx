import useAppTranslation from '@hooks/useAppTranslation';
import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
  CardSectionTitle,
  TwoColumnsRow,
} from './CardSection';
import { Box } from '@mui/material';
import { MenuItem, Tabs, TextField, TimePicker } from '@components/index';
import { useState } from 'react';
import { handleNumber, textFieldSelectStyles } from './utils';
import SwitchItem from './SwitchItem';

const CongregationSection = () => {
  const { t } = useAppTranslation();

  const [circuitNumber, setCircuitNumber] = useState(254);
  const [kingdomHallAddress, setKingdomHallAddress] = useState('');
  const [use24HourFormat, setUse24HourFormat] = useState(true);
  const [startWeekOnSunday, setStartWeekOnSunday] = useState(false);
  const [recordOnlineAttendance, setRecordOnlineAttendance] = useState(false);

  // Meeting settings : Midweek
  const [midweekDay, setMidweekDay] = useState('tuesday');
  const [midweekTime, setMidweekTime] = useState(
    new Date('2021-01-01T17:00:00.000Z')
  );
  const [midweekAutoAssignOpeningPrayer, setMidweekAutoAssignOpeningPrayer] =
    useState(true);
  const [midweekAutoAssignClosingPrayer, setMidweekAutoAssignClosingPrayer] =
    useState(false);
  const [midweekAssignAuxClassroom, setMidWeekAssignAuxClassroom] =
    useState(true);
  const [midweekAuxClassroomCount, setMidweekAuxClassroomCount] = useState(2);
  const [midweekAssignAuxCounselor, setMidweekAssignAuxCounselor] =
    useState(true);
  const [midweekAuxClassCounselor, setMidweekAuxClassCounselor] =
    useState('first');

  // Meeting settings : Weekend
  const [weekendDay, setWeekendDay] = useState('tuesday');
  const [weekendTime, setWeekendTime] = useState(
    new Date('2021-01-01T17:00:00.000Z')
  );
  const [weekendAutoAssignOpeningPrayer, setWeekendAutoAssignOpeningPrayer] =
    useState(true);
  const [
    weekendAppointVisitingSubstitution,
    setWeekendAppointVisitingSubstitution,
  ] = useState(false);
  const [
    weekendDisplaySubstitutionInSchedule,
    setWeekendDisplaySubstitutionInSchedule,
  ] = useState(true);
  const [weekendSubstitutionConductor, setWeekendSubstitutionConductor] =
    useState('');
  const [weekendShowRepeatedWarning, setWeekendShowRepeatedWarning] =
    useState(false);

  const tabs = [
    {
      label: t('tr_midweek'),
      Component: (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TwoColumnsRow>
            <TextField
              select
              label={t('tr_meetingDay')}
              value={midweekDay}
              onChange={(e) => setMidweekDay(e.target.value)}
              {...textFieldSelectStyles}
            >
              {startWeekOnSunday && <MenuItem value="sunday">Sunday</MenuItem>}
              <MenuItem value={'monday'}>{t('tr_monday')}</MenuItem>
              <MenuItem value={'tuesday'}>{t('tr_tuesday')}</MenuItem>
              <MenuItem value={'wednesday'}>{t('tr_wednesday')}</MenuItem>
              <MenuItem value={'thursday'}>{t('tr_thursday')}</MenuItem>
              <MenuItem value={'friday'}>{t('tr_friday')}</MenuItem>
              <MenuItem value={'saturday'}>{t('tr_saturday')}</MenuItem>
              {!startWeekOnSunday && <MenuItem value="sunday">Sunday</MenuItem>}
            </TextField>
            <TimePicker
              value={midweekTime}
              onChange={(time) => setMidweekTime(time)}
              ampm={!use24HourFormat}
              label={t('tr_timerLabelTime')}
            />
          </TwoColumnsRow>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <SwitchItem
              value={midweekAutoAssignOpeningPrayer}
              setValue={setMidweekAutoAssignOpeningPrayer}
              label={t('tr_autoAssignOpeningPrayer')}
            />
            <SwitchItem
              label={t('tr_autoAssignClosingPrayer')}
              value={midweekAutoAssignClosingPrayer}
              setValue={setMidweekAutoAssignClosingPrayer}
            />
            <TwoColumnsRow>
              <SwitchItem
                label={t('tr_auxClassroom')}
                value={midweekAssignAuxClassroom}
                setValue={setMidWeekAssignAuxClassroom}
              />
              <TextField
                select
                disabled={!midweekAssignAuxClassroom}
                label={t('tr_count')}
                value={midweekAuxClassroomCount}
                onChange={(e) => handleNumber(e, setMidweekAuxClassroomCount)}
                {...textFieldSelectStyles}
              >
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
              </TextField>
            </TwoColumnsRow>
            <TwoColumnsRow>
              <SwitchItem
                label={t('tr_assignAuxCounselor')}
                helper={t('tr_assignAuxCounserlorDesc')}
                value={midweekAssignAuxCounselor}
                setValue={setMidweekAssignAuxCounselor}
              />
              <TextField
                select
                disabled={!midweekAssignAuxCounselor}
                label={t('tr_auxClassCounselor')}
                value={midweekAuxClassCounselor}
                onChange={(e) => setMidweekAuxClassCounselor(e.target.value)}
                {...textFieldSelectStyles}
              >
                <MenuItem value="jamesSmith">James Smith</MenuItem>
                <MenuItem value="michaelWilliams">Michael Williams</MenuItem>
                <MenuItem value="haja">Haja 🐈</MenuItem>
              </TextField>
            </TwoColumnsRow>
          </Box>
        </Box>
      ),
    },
    {
      label: t('tr_weekend'),
      Component: (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TwoColumnsRow>
            <TextField
              select
              label={t('tr_meetingDay')}
              value={weekendDay}
              onChange={(e) => setWeekendDay(e.target.value)}
              {...textFieldSelectStyles}
            >
              {startWeekOnSunday && <MenuItem value="sunday">Sunday</MenuItem>}
              <MenuItem value={'monday'}>{t('tr_monday')}</MenuItem>
              <MenuItem value={'tuesday'}>{t('tr_tuesday')}</MenuItem>
              <MenuItem value={'wednesday'}>{t('tr_wednesday')}</MenuItem>
              <MenuItem value={'thursday'}>{t('tr_thursday')}</MenuItem>
              <MenuItem value={'friday'}>{t('tr_friday')}</MenuItem>
              <MenuItem value={'saturday'}>{t('tr_saturday')}</MenuItem>
              {!startWeekOnSunday && <MenuItem value="sunday">Sunday</MenuItem>}
            </TextField>
            <TimePicker
              value={weekendTime}
              onChange={(time) => setWeekendTime(time)}
              ampm={!use24HourFormat}
              label={t('tr_timerLabelTime')}
            />
          </TwoColumnsRow>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <SwitchItem
              value={weekendAutoAssignOpeningPrayer}
              setValue={setWeekendAutoAssignOpeningPrayer}
              label={t('tr_autoAssignOpeningPrayer')}
            />
            <SwitchItem
              label={t('tr_appointSubsisuteSpeaker')}
              value={weekendAppointVisitingSubstitution}
              setValue={setWeekendAppointVisitingSubstitution}
            />
            <TwoColumnsRow>
              <SwitchItem
                label={t('tr_displayWSConductorSubstitutions')}
                helper={t('tr_displayWSConductorDesc')}
                value={weekendDisplaySubstitutionInSchedule}
                setValue={setWeekendDisplaySubstitutionInSchedule}
              />
              <TextField
                select
                disabled={!midweekAssignAuxClassroom}
                label={t('tr_mainStudyConductor')}
                value={weekendSubstitutionConductor}
                onChange={(e) =>
                  setWeekendSubstitutionConductor(e.target.value)
                }
                {...textFieldSelectStyles}
              >
                <MenuItem value="jamesSmith">James Smith</MenuItem>
                <MenuItem value="michaelWilliams">Michael Williams</MenuItem>
                <MenuItem value="haja">Haja 🐈</MenuItem>
              </TextField>
            </TwoColumnsRow>
            <SwitchItem
              value={weekendShowRepeatedWarning}
              setValue={setWeekendShowRepeatedWarning}
              label={t('tr_repeatedMonthlyWarning')}
              helper={t('tr_repeatedMonthlyWarningDesc')}
            />
          </Box>
        </Box>
      ),
    },
  ];

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
          <SwitchItem
            label={t('tr_24hFormat')}
            value={use24HourFormat}
            setValue={setUse24HourFormat}
          />
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
      <CardSectionContent>
        <CardSectionTitle>{t('tr_meetingSettings')}</CardSectionTitle>
        <Tabs tabs={tabs} />
      </CardSectionContent>
    </CardSection>
  );
};

export default CongregationSection;
