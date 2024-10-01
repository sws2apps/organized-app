import Select from '@components/select';
import useAppTranslation from '@hooks/useAppTranslation';
import { Box, SelectChangeEvent } from '@mui/material';
import useMonthlyView from './useMonthlyView';
import { MonthlyViewChairmanType, MonthlyViewHeaderType } from './index.types';
import MenuItem from '@components/menuitem';
import WeekBadge from './week_badge';
import Typography from '@components/typography';
import { t } from 'i18next';
import PersonSelector from '../person_selector';
import { AssignmentCode } from '@definition/assignment';
import Divider from '@components/divider';
import MeetingSection from '../meeting_section';
import { IconMinistryPart, IconTreasuresPart } from '@components/icons';
import { useState } from 'react';
import { Week } from '@definition/week_type';

const MonthlyViewHeader = (props: MonthlyViewHeaderType) => {
  const { t } = useAppTranslation();
  const { monthsNames, currentYear, getWeeksByMonthAndYear, getWeekLocale } =
    useMonthlyView();

  return (
    <Box
      sx={{
        flexDirection: 'row',
        alignItems: 'center',
        display: 'flex',
        gap: '16px',
      }}
    >
      <Select
        label={t('tr_month')}
        sx={{
          maxWidth: '196px',
        }}
        value={props.selectedMonth.toString()}
        onChange={props.handleSelectedMonthChange}
      >
        {monthsNames.map((value, index) => {
          return (
            <MenuItem value={index} key={index}>
              {value}
            </MenuItem>
          );
        })}
      </Select>
      {getWeeksByMonthAndYear(parseInt(currentYear), props.selectedMonth).map(
        (value, index) => {
          return (
            <WeekBadge
              key={index}
              text={getWeekLocale(
                new Date(value).getDate(),
                monthsNames[props.selectedMonth]
              )}
            />
          );
        }
      )}
    </Box>
  );
};

const MonthlyViewChairman = (props: MonthlyViewChairmanType) => {
  const { getWeeksByMonthAndYear } = useMonthlyView();

  return (
    <>
      <Box
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          display: 'flex',
          gap: '16px',
        }}
      >
        <Typography className="h4" color={'var(--black)'} width={`${196}px`}>
          {t('tr_chairman')}
        </Typography>
        {getWeeksByMonthAndYear(
          parseInt(props.currentYear),
          props.selectedMonth
        ).map((value, index) => {
          return (
            <PersonSelector
              key={index}
              week={value}
              notShowIcon
              label={t('tr_chairman')}
              type={AssignmentCode.MM_Chairman}
              assignment="MM_Chairman_A"
              readOnly={false}
            />
          );
        })}
      </Box>
      <Divider color="var(--grey-200)" />
    </>
  );
};

const MonthlyViewAuxClassCounselor = (props: MonthlyViewChairmanType) => {
  const { getWeeksByMonthAndYear, classCount, loadWeekTypeByWeekDate } =
    useMonthlyView();

  const weeks = getWeeksByMonthAndYear(
    parseInt(props.currentYear),
    props.selectedMonth
  );

  const generateLoadedWeeks = () => {
    const loadedTypes = [];

    weeks.forEach((value) => {
      loadedTypes.push(loadWeekTypeByWeekDate(value));
    });

    return loadedTypes;
  };

  const [weeksTypes] = useState(() => {
    return generateLoadedWeeks();
  });

  const showDoublePerson = (weekIndex: number) => {
    return weeksTypes[weekIndex] !== Week.CO_VISIT;
  };

  return (
    classCount == 2 && (
      <>
        <Box
          sx={{
            flexDirection: 'row',
            alignItems: 'center',
            display: 'flex',
            gap: '16px',
          }}
        >
          <Typography className="h4" color={'var(--black)'} width={`${196}px`}>
            {t('tr_auxClassCounselor')}
          </Typography>
          {weeks.map((value, index) => {
            return showDoublePerson(index) ? (
              <PersonSelector
                key={index}
                week={value}
                notShowIcon
                label={t('tr_auxClassCounselor')}
                type={AssignmentCode.MM_AuxiliaryCounselor}
                assignment="MM_Chairman_B"
                readOnly={false}
              />
            ) : (
              <Box flex={1} />
            );
          })}
        </Box>
        <Divider color="var(--grey-200)" />
      </>
    )
  );
};

const MonthlyViewOpeningPlayer = (props: MonthlyViewChairmanType) => {
  const { getWeeksByMonthAndYear, openingPrayerAuto } = useMonthlyView();

  return (
    !openingPrayerAuto && (
      <>
        <Box
          sx={{
            flexDirection: 'row',
            alignItems: 'center',
            display: 'flex',
            gap: '16px',
          }}
        >
          <Typography className="h4" color={'var(--black)'} width={`${196}px`}>
            {t('tr_openingPrayer')}
          </Typography>
          {getWeeksByMonthAndYear(
            parseInt(props.currentYear),
            props.selectedMonth
          ).map((value, index) => {
            return (
              <PersonSelector
                key={index}
                week={value}
                label={t('tr_prayer')}
                type={AssignmentCode.MM_Prayer}
                notShowIcon
                assignment="MM_OpeningPrayer"
                readOnly={false}
              />
            );
          })}
        </Box>
      </>
    )
  );
};

const MonthlyViewTGWTalk = (props: MonthlyViewChairmanType) => {
  const { getWeeksByMonthAndYear } = useMonthlyView();

  return (
    <>
      <Box
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          display: 'flex',
          gap: '16px',
        }}
      >
        <Typography
          className="h4"
          color={'var(--text-treasures-from-gods-word)'}
          width={`${196}px`}
        >
          {t('tr_tgwTalk')}
        </Typography>
        {getWeeksByMonthAndYear(
          parseInt(props.currentYear),
          props.selectedMonth
        ).map((value, index) => {
          return (
            <PersonSelector
              week={value}
              key={index}
              notShowIcon
              label={t('tr_conductor')}
              type={AssignmentCode.MM_TGWTalk}
              assignment="MM_TGWTalk"
              readOnly={false}
            />
          );
        })}
      </Box>
      <Divider color="var(--grey-200)" />
    </>
  );
};

const MonthlyViewTGWGems = (props: MonthlyViewChairmanType) => {
  const { getWeeksByMonthAndYear } = useMonthlyView();

  return (
    <>
      <Box
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          display: 'flex',
          gap: '16px',
        }}
      >
        <Typography
          className="h4"
          color={'var(--text-treasures-from-gods-word)'}
          width={`${196}px`}
        >
          {t('tr_tgwGems')}
        </Typography>
        {getWeeksByMonthAndYear(
          parseInt(props.currentYear),
          props.selectedMonth
        ).map((value, index) => {
          return (
            <PersonSelector
              week={value}
              key={index}
              notShowIcon
              label={t('tr_conductor')}
              type={AssignmentCode.MM_TGWTalk}
              assignment="MM_TGWTalk"
              readOnly={false}
            />
          );
        })}
      </Box>
      <Divider color="var(--grey-200)" />
    </>
  );
};

const MonthlyViewTGWBibleReading = (props: MonthlyViewChairmanType) => {
  const { getWeeksByMonthAndYear, classCount, loadWeekTypeByWeekDate } =
    useMonthlyView();

  const weeks = getWeeksByMonthAndYear(
    parseInt(props.currentYear),
    props.selectedMonth
  );

  const generateLoadedWeeks = () => {
    const loadedTypes = [];

    weeks.forEach((value) => {
      loadedTypes.push(loadWeekTypeByWeekDate(value));
    });

    return loadedTypes;
  };

  const [weeksTypes] = useState(() => {
    return generateLoadedWeeks();
  });

  const showDoublePerson = (weekIndex: number) => {
    return weeksTypes[weekIndex] !== Week.CO_VISIT;
  };

  return (
    <>
      <Box
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          display: 'flex',
          gap: '16px',
        }}
      >
        <Box width={'196px'}></Box>
        <Typography className="body-small-semibold" color={'var(--grey-350)'}>
          {t('tr_mainHall')}
        </Typography>
      </Box>
      <Box
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          display: 'flex',
          gap: '16px',
        }}
      >
        <Typography
          className="h4"
          color={'var(--text-treasures-from-gods-word)'}
          width={`${196}px`}
        >
          {t('tr_bibleReading')}
        </Typography>
        {getWeeksByMonthAndYear(
          parseInt(props.currentYear),
          props.selectedMonth
        ).map((value, index) => {
          return showDoublePerson ? (
            <PersonSelector
              key={index}
              week={value}
              notShowIcon
              label={t('tr_student')}
              type={AssignmentCode.MM_BibleReading}
              assignment="MM_TGWBibleReading_A"
              readOnly={false}
            />
          ) : (
            <Box flex={1} />
          );
        })}
      </Box>
      {classCount === 2 && (
        <>
          <Box
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              display: 'flex',
              gap: '16px',
            }}
          >
            <Box width={'196px'}></Box>
            <Typography
              className="body-small-semibold"
              color={'var(--grey-350)'}
            >
              {t('tr_auxClassroom')}
            </Typography>
          </Box>
          <Box
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              display: 'flex',
              gap: '16px',
            }}
          >
            <Box width={'196px'}></Box>
            {getWeeksByMonthAndYear(
              parseInt(props.currentYear),
              props.selectedMonth
            ).map((value, index) => {
              return (
                <PersonSelector
                  key={index}
                  week={value}
                  notShowIcon
                  label={t('tr_student')}
                  type={AssignmentCode.MM_BibleReading}
                  assignment="MM_TGWBibleReading_B"
                  readOnly={false}
                />
              );
            })}
          </Box>
        </>
      )}
    </>
  );
};

const MonthlyView = () => {
  const {
    selectedMonth,
    setSelectedMonth,
    currentYear,
    openingPrayerAuto,
    openTGW,
    openAYF,
    handleToggleTGW,
    handleToggleAYF,
  } = useMonthlyView();

  const handleSelectedMonthChanged = (e: SelectChangeEvent<string>) => {
    setSelectedMonth(Number.parseInt(e.target.value));
  };

  return (
    <Box
      sx={{
        padding: '16px',
        gap: '16px',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--white)',
      }}
    >
      <MonthlyViewHeader
        selectedMonth={selectedMonth}
        handleSelectedMonthChange={handleSelectedMonthChanged}
      />

      <MonthlyViewChairman
        currentYear={currentYear}
        selectedMonth={selectedMonth}
      />

      <MonthlyViewAuxClassCounselor
        currentYear={currentYear}
        selectedMonth={selectedMonth}
      />

      {!openingPrayerAuto && (
        <MonthlyViewOpeningPlayer
          currentYear={currentYear}
          selectedMonth={selectedMonth}
        />
      )}

      <MeetingSection
        part={t('tr_treasuresPart')}
        color="var(--treasures-from-gods-word)"
        icon={<IconTreasuresPart color="var(--always-white)" />}
        expanded={openTGW}
        onToggle={handleToggleTGW}
      >
        <MonthlyViewTGWTalk
          currentYear={currentYear}
          selectedMonth={selectedMonth}
        />
        <MonthlyViewTGWGems
          currentYear={currentYear}
          selectedMonth={selectedMonth}
        />
        <MonthlyViewTGWBibleReading
          currentYear={currentYear}
          selectedMonth={selectedMonth}
        />
      </MeetingSection>
      <MeetingSection
        part={t('tr_applyFieldMinistryPart')}
        color="var(--apply-yourself-to-the-field-ministry)"
        icon={<IconMinistryPart color="var(--always-white)" />}
        expanded={openAYF}
        onToggle={handleToggleAYF}
      ></MeetingSection>
    </Box>
  );
};

export default MonthlyView;
