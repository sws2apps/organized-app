import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Popper from '@mui/material/Popper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import maleIcon from '../../img/student_male.svg';
import femaleIcon from '../../img/student_female.svg';
import { Persons } from '../../classes/Persons';
import { formatDateForCompare } from '../../utils/app';
import { refreshCurrentWeekState } from '../../states/schedule';
import { Setting } from '../../classes/Setting';
import { Schedules } from '../../classes/Schedules';
import { isLightThemeState } from '../../states/main';
import { VisitingSpeakers } from '../../classes/VisitingSpeakers';

const PersonsOption = (props) => {
  return <Popper {...props} style={{ minWidth: 320 }} placement="bottom-start" />;
};

const HtmlTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#EC7063',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    marginTop: '5px !important',
  },
}));

const OptionHeader = ({ option, isLightTheme, ayf, isAssistant, filterEnabled, gender, setGender }) => {
  const { t } = useTranslation('ui');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '2px 12px 3px 15px',
        position: 'fixed',
        top: 0,
        right: option ? 20 : 0,
        left: 0,
        zIndex: '1000',
        backgroundColor: isLightTheme ? 'white' : 'black',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography sx={{ width: '180px' }}>{t('name')}</Typography>
        {option && (
          <>
            <Typography sx={{ width: '140px', textAlign: 'center' }}>{t('lastAssignment')}</Typography>
            {ayf && <Typography sx={{ width: '140px', textAlign: 'center' }}>{t('assistant')}</Typography>}
          </>
        )}
      </Box>
      {!isAssistant && filterEnabled && (
        <RadioGroup
          key={`radio-${option ? option.person_uid : 'no-option'}`}
          aria-labelledby="demo-radio-buttons-group-label"
          value={gender}
          name="radio-buttons-group"
          sx={{ flexDirection: 'row', margin: '5px 0', paddingTop: '5px', borderTop: '2px outset' }}
          onChange={(e) => setGender(e.target.value)}
        >
          <FormControlLabel color="secondary" value="male" control={<Radio />} label={t('male')} />
          <FormControlLabel value="female" control={<Radio />} label={t('female')} />
        </RadioGroup>
      )}
    </Box>
  );
};

const PersonSelect = ({
  ayf,
  assID,
  assType,
  currentWeek,
  stuForAssistant,
  handleSave,
  edit,
  co,
  person,
  isLC,
  isElderPart,
  visitingSpeaker,
  isAYFExplainTalk,
}) => {
  const { t } = useTranslation('ui');
  const location = useLocation();

  const currentPerson = Persons.get(person);

  const refreshCurrent = useRecoilValue(refreshCurrentWeekState);
  const isLightTheme = useRecoilValue(isLightThemeState);

  const [options, setOptions] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [gender, setGender] = useState(currentPerson ? (currentPerson.isMale ? 'male' : 'female') : 'female');
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [hasWarning, setHasWarning] = useState(false);

  const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
  const secretaryRole = Setting.cong_role.includes('secretary');
  const coordinatorRole = Setting.cong_role.includes('coordinator');
  const publicTalkCoordinatorRole = Setting.cong_role.includes('public_talk_coordinator');
  const viewMeetingScheduleRole =
    !lmmoRole &&
    !secretaryRole &&
    !coordinatorRole &&
    !publicTalkCoordinatorRole &&
    Setting.cong_role.includes('view_meeting_schedule');
  const pocketRole = Setting.account_type === 'pocket' || viewMeetingScheduleRole;

  const isAssistant =
    assID === 3 ||
    assID === 5 ||
    assID === 7 ||
    assID === 9 ||
    assID === 11 ||
    assID === 13 ||
    assID === 15 ||
    assID === 17;

  const isScheduleView = location.pathname.includes('schedules/view/');

  const handleSaveAssignment = (value) => {
    handleSave({ ...value, assID });
  };

  const getPersonIcon = () => {
    if (pocketRole || selectedPerson === null || (visitingSpeaker && !person)) return null;
    if (selectedPerson.isMale || (visitingSpeaker && person)) return maleIcon;
    return femaleIcon;
  };

  useEffect(() => {
    setFilterEnabled(false);

    if (ayf) {
      if (
        assType === 101 ||
        assType === 102 ||
        assType === 103 ||
        assType === 108 ||
        assType === 123 ||
        assType === 124 ||
        assType === 125 ||
        (assType === 126 && !isAYFExplainTalk) ||
        (assType >= 140 && assType < 170) ||
        (assType >= 170 && assType < 200)
      ) {
        setFilterEnabled(true);
      }
    }
  }, [ayf, assType, isAYFExplainTalk]);

  useEffect(() => {
    let persons = [];

    if (co) {
      const coName = Setting.co_displayName;
      const value = { person_uid: window.crypto.randomUUID(), person_displayName: coName, isMale: true };
      setOptions([value]);
      setSelectedPerson(value);
      return;
    }

    if (pocketRole) {
      const value = { person_uid: window.crypto.randomUUID(), person_displayName: person };
      setOptions([value]);
      setSelectedPerson(value);
      return;
    }

    if (visitingSpeaker) {
      const value = {
        person_uid: person,
        person_displayName: VisitingSpeakers.getSpeakerByUid(person)?.person_displayName || '',
      };
      setOptions([value]);
      setSelectedPerson(value);
      return;
    }

    if (isAssistant) {
      persons = Persons.getByAssignment({ assType: 'isAssistant', stuForAssistant });
    } else {
      persons = Persons.getByAssignment({ assType, gender, isLC, isElderPart, isAYFExplainTalk });
    }

    // remove unavailable persons based on time away
    let available = [];
    for (const student of persons) {
      if (student.timeAway.length === 0) {
        available.push(student);
      } else {
        const timeAways = student.timeAway;

        for (const timeAway of timeAways) {
          if (timeAway.endDate === null) {
            const dateA = formatDateForCompare(currentWeek);
            const dateB = formatDateForCompare(timeAway.startDate);
            if (dateA < dateB) {
              available.push(student);
              break;
            }
          } else {
            const dateA = formatDateForCompare(currentWeek);
            const dateB = formatDateForCompare(timeAway.startDate);
            const dateC = formatDateForCompare(timeAway.endDate);

            if (dateA < dateB || dateA > dateC) {
              available.push(student);
              break;
            }
          }
        }
      }
    }

    setOptions(available);
    setSelectedPerson(Persons.get(person) || null);
  }, [
    co,
    isAssistant,
    currentWeek,
    assID,
    assType,
    stuForAssistant,
    gender,
    filterEnabled,
    person,
    refreshCurrent,
    pocketRole,
    isLC,
    isElderPart,
    visitingSpeaker,
    isAYFExplainTalk,
  ]);

  useEffect(() => {
    setHasWarning(false);

    if (selectedPerson !== null && edit) {
      const activeRecords = Schedules.history.filter(
        (record) => record.weekOf === currentWeek && record.studentID === selectedPerson.person_uid
      );
      setHasWarning(activeRecords.length > 1);
    }
  }, [assID, selectedPerson, currentWeek, refreshCurrent, edit]);

  return (
    <HtmlTooltip
      title={
        hasWarning ? (
          <Typography sx={{ fontWeight: 'bold', fontSize: '13px' }} color="inherit">
            {t('scheduleAlreadyAssignedWarning')}
          </Typography>
        ) : (
          ''
        )
      }
    >
      <Autocomplete
        key={isScheduleView ? crypto.randomUUID() : undefined}
        id="person-select"
        size="small"
        sx={{ width: '220px' }}
        options={options}
        value={selectedPerson}
        freeSolo={co || !edit}
        readOnly={co || !edit}
        onChange={(e, value) => handleSaveAssignment(value)}
        getOptionLabel={(option) => option.person_displayName}
        isOptionEqualToValue={(option, value) => option.person_uid === value.person_uid}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{ border: hasWarning ? '1px solid red' : null }}
            InputProps={{
              ...params.InputProps,
              startAdornment: <Avatar sx={{ height: '20px', width: '20px' }} alt="Person icon" src={getPersonIcon()} />,
            }}
          />
        )}
        PopperComponent={PersonsOption}
        ListboxProps={{ margin: '120px' }}
        noOptionsText={
          <Box>
            <OptionHeader
              key="header-no-option"
              ayf={ayf}
              filterEnabled={filterEnabled}
              gender={gender}
              setGender={(value) => setGender(value)}
              isLightTheme={isLightTheme}
              isAssistant={isAssistant}
            />
            <Box sx={{ height: filterEnabled && !isAssistant ? '80px' : '20px' }}></Box>
            <Typography>{t('noOptions')}</Typography>
          </Box>
        }
        renderOption={(props, option) => {
          const currentIndex = options.findIndex((item) => item.person_uid === option.person_uid);
          return (
            <Box key={`header-${option.person_uid}`}>
              {currentIndex === 0 && (
                <OptionHeader
                  key={`header-${option.person_uid}`}
                  option={option}
                  ayf={ayf}
                  filterEnabled={filterEnabled}
                  gender={gender}
                  setGender={(value) => setGender(value)}
                  isLightTheme={isLightTheme}
                  isAssistant={isAssistant}
                />
              )}

              {currentIndex === 0 && <Box sx={{ height: !isAssistant && filterEnabled ? '80px' : '20px' }}></Box>}

              <Box
                key={`root-option-${option.person_uid}`}
                component="li"
                {...props}
                sx={{
                  backgroundColor: '#D5D8DC !important',
                  color: 'black',
                }}
              >
                <Box
                  key={`option-${option.person_uid}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '180px' }}>
                    <Avatar
                      sx={{ height: '20px', width: '20px', marginRight: '10px' }}
                      alt="Person icon"
                      src={option.isMale || visitingSpeaker ? maleIcon : femaleIcon}
                    />
                    <Typography>{option.person_displayName}</Typography>
                  </Box>

                  <Typography sx={{ width: '140px', textAlign: 'center' }}>{option.lastAssignmentFormat}</Typography>

                  {ayf && (
                    <Typography sx={{ width: '140px', textAlign: 'center' }}>{option.lastAssistantFormat}</Typography>
                  )}
                </Box>
              </Box>
            </Box>
          );
        }}
      />
    </HtmlTooltip>
  );
};

export default PersonSelect;
