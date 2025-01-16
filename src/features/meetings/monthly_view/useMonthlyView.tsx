import { AssignmentCode } from '@definition/assignment';
import { Week } from '@definition/week_type';
import useAppTranslation from '@hooks/useAppTranslation';
import {
  sourcesCheckAYFExplainBeliefsAssignment,
  sourcesCheckLCAssignments,
} from '@services/app/sources';
import { dbSourcesUpdate } from '@services/dexie/sources';
import { monthNamesState } from '@states/app';
import { schedulesState } from '@states/schedules';
import {
  JWLangState,
  midweekMeetingClassCountState,
  midweekMeetingClosingPrayerAutoAssign,
  midweekMeetingOpeningPrayerAutoAssign,
  userDataViewState,
} from '@states/settings';
import { sourcesFormattedState, sourcesState } from '@states/sources';
import { SetStateAction, useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

const useMonthlyView = () => {
  const { t } = useAppTranslation();

  const monthNames = useRecoilValue(monthNamesState);
  const sourcesFormatted = useRecoilValue(sourcesFormattedState);
  const sources = useRecoilValue(sourcesState);
  const schedules = useRecoilValue(schedulesState);
  const dataView = useRecoilValue(userDataViewState);
  const classCount = useRecoilValue(midweekMeetingClassCountState);
  const lang = useRecoilValue(JWLangState);
  const openingPrayerAuto = useRecoilValue(
    midweekMeetingOpeningPrayerAutoAssign
  );
  const closingPrayerAuto = useRecoilValue(
    midweekMeetingClosingPrayerAutoAssign
  );

  const getWeeksByMonthAndYear = useCallback(
    (year: number, month: number) => {
      let weeks = [];
      sourcesFormatted.forEach((srcYear) => {
        if (srcYear.value == year) {
          weeks = srcYear.months.find(
            (formattedMonth) => formattedMonth.value == month
          ).weeks;
        }
      });
      return weeks;
    },
    [sourcesFormatted]
  );

  const currentYear = new Date().getFullYear().toString();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedWeeks, setSelectedWeeks] = useState(
    getWeeksByMonthAndYear(parseInt(currentYear), selectedMonth)
  );

  const [weeksTypes, setWeeksTypes] = useState(
    Array(selectedWeeks.length).fill(Week.NORMAL)
  );
  const [ayfCount, setAyfCount] = useState(Array(selectedWeeks.length).fill(1));
  const [ayfParts1, setAyfParts1] = useState<AssignmentCode[]>(
    Array(selectedWeeks.length).fill(null)
  );
  const [ayfParts2, setAyfParts2] = useState<AssignmentCode[]>(
    Array(selectedWeeks.length).fill(null)
  );
  const [ayfParts3, setAyfParts3] = useState<AssignmentCode[]>(
    Array(selectedWeeks.length).fill(null)
  );
  const [ayfParts4, setAyfParts4] = useState<AssignmentCode[]>(
    Array(selectedWeeks.length).fill(null)
  );
  const [isTalkAYFParts1, setIsTalkAYFParts1] = useState(
    Array(selectedWeeks.length).fill(false)
  );
  const [isTalkAYFParts2, setIsTalkAYFParts2] = useState(
    Array(selectedWeeks.length).fill(false)
  );
  const [isTalkAYFParts3, setIsTalkAYFParts3] = useState(
    Array(selectedWeeks.length).fill(false)
  );
  const [isTalkAYFParts4, setIsTalkAYFParts4] = useState(
    Array(selectedWeeks.length).fill(false)
  );
  const [lcCount, setLcCount] = useState(Array(selectedWeeks.length).fill(1));
  const [customPartEnabled, setCustomPartEnabled] = useState(
    Array(selectedWeeks.length).fill(true)
  );
  const [lcNoAssignParts1, setLcNoAssignParts1] = useState(
    Array(selectedWeeks.length).fill(false)
  );
  const [lcNoAssignParts2, setLcNoAssignParts2] = useState(
    Array(selectedWeeks.length).fill(false)
  );
  const [lcNoAssignParts3, setLcNoAssignParts3] = useState(
    Array(selectedWeeks.length).fill(false)
  );
  const [isOverwriteLCParts1, setIsOverwriteLCParts1] = useState(
    Array(selectedWeeks.length).fill(false)
  );
  const [isOverwriteLCParts2, setIsOverwriteLCParts2] = useState(
    Array(selectedWeeks.length).fill(false)
  );
  const [hasCustomPart, setHasCustomPart] = useState(
    Array(selectedWeeks.length).fill(false)
  );

  const [openTGW, setOpenTGW] = useState(true);
  const [openAYF, setOpenAYF] = useState(true);
  const [openLC, setOpenLC] = useState(true);

  const [openAddCustomModalWindow, setOpenAddCustomModalWindow] =
    useState(false);
  const [addCustomModalWindowWeek, setAddCustomModalWindowWeek] =
    useState(null);

  const thisYearMonths = sourcesFormatted
    .find((year) => year.value.toString() === currentYear)
    .months.toReversed()
    .map((month) => monthNames[month.value]);

  const monthName = thisYearMonths[selectedMonth];

  const getWeekLocale = (date, monthName) => {
    return t('tr_longDateNoYearLocale', {
      date,
      month: monthName,
    });
  };

  const showDoublePerson = weeksTypes.map((week) => {
    return week.value !== Week.CO_VISIT;
  });

  const showAYFPartAssistant = (
    ayfPart: AssignmentCode[],
    isTalkAYFPart: unknown[]
  ) => {
    return ayfPart.map((value, index) => {
      return (
        (value !== AssignmentCode.MM_ExplainingBeliefs &&
          value !== AssignmentCode.MM_Talk &&
          value !== AssignmentCode.MM_Discussion) ||
        (value === AssignmentCode.MM_ExplainingBeliefs && !isTalkAYFPart[index])
      );
    });
  };

  const showAYFPartDoublePerson = (ayfPart: AssignmentCode[]) => {
    return ayfPart.map((value, index) => {
      return showDoublePerson[index] && value !== AssignmentCode.MM_Discussion;
    });
  };

  const showAYFParts1Assistant = showAYFPartAssistant(
    ayfParts1,
    isTalkAYFParts1
  );
  const showAYFParts2Assistant = showAYFPartAssistant(
    ayfParts2,
    isTalkAYFParts2
  );
  const showAYFParts3Assistant = showAYFPartAssistant(
    ayfParts3,
    isTalkAYFParts3
  );
  const showAYFParts4Assistant = showAYFPartAssistant(
    ayfParts4,
    isTalkAYFParts4
  );

  const showAYFParts1DoublePerson = showAYFPartDoublePerson(ayfParts1);
  const showAYFParts2DoublePerson = showAYFPartDoublePerson(ayfParts2);
  const showAYFParts3DoublePerson = showAYFPartDoublePerson(ayfParts3);
  const showAYFParts4DoublePerson = showAYFPartDoublePerson(ayfParts4);

  const handleToggleTGW = () => setOpenTGW((prev) => !prev);

  const handleToggleAYF = () => setOpenAYF((prev) => !prev);

  const handleToggleLC = () => setOpenLC((prev) => !prev);

  const changeValueInArrayState = (
    func: (value: SetStateAction<unknown[]>) => void,
    index: number,
    value: unknown
  ) => {
    func((prev) => {
      const newTmpArray = [...prev];
      newTmpArray[index] = value;
      return newTmpArray;
    });
  };

  useEffect(() => {
    setSelectedWeeks(
      getWeeksByMonthAndYear(parseInt(currentYear), selectedMonth)
    );
  }, [currentYear, getWeeksByMonthAndYear, selectedMonth]);

  useEffect(() => {
    selectedWeeks.forEach((value, index) => {
      const schedule = schedules.find((record) => record.weekOf === value);

      const weekType = schedule.midweek_meeting.week_type.find(
        (record) => record.type === dataView
      );

      changeValueInArrayState(setWeeksTypes, index, weekType);
    });
  }, [selectedWeeks, schedules, dataView]);

  useEffect(() => {
    const ayfPartsSetters = [
      setAyfParts1,
      setAyfParts2,
      setAyfParts3,
      setAyfParts4,
    ];

    const isTalkAYFPartsSetters = [
      setIsTalkAYFParts1,
      setIsTalkAYFParts2,
      setIsTalkAYFParts3,
      setIsTalkAYFParts4,
    ];

    selectedWeeks.forEach((value, index) => {
      const source = sources.find((record) => record.weekOf === value);

      changeValueInArrayState(
        setAyfCount,
        index,
        source.midweek_meeting.ayf_count[lang]
      );

      ayfPartsSetters.forEach((setter, setterIndex) => {
        const ayfPart = source.midweek_meeting[`ayf_part${setterIndex + 1}`];

        changeValueInArrayState(setter, index, ayfPart.type[lang]);

        if (ayfPart.type[lang] === AssignmentCode.MM_ExplainingBeliefs) {
          changeValueInArrayState(
            isTalkAYFPartsSetters[setterIndex],
            index,
            sourcesCheckAYFExplainBeliefsAssignment(ayfPart.src[lang], lang)
          );
        }
      });
    });
  }, [lang, selectedWeeks, sources]);

  useEffect(() => {
    const lcNoAssignPartsSetters = [setLcNoAssignParts1, setLcNoAssignParts2];

    const isOverwriteLCPartsSetters = [
      setIsOverwriteLCParts1,
      setIsOverwriteLCParts2,
    ];

    selectedWeeks.forEach((value, index) => {
      const source = sources.find((record) => record.weekOf === value);

      const lcCountOverride =
        source.midweek_meeting.lc_count.override.find(
          (record) => record.type === dataView
        )?.value || 0;

      const lcCount = source.midweek_meeting.lc_count.default[lang];

      changeValueInArrayState(setLcCount, index, lcCount);

      changeValueInArrayState(
        setCustomPartEnabled,
        index,
        lcCountOverride < lcCount + 1
      );

      changeValueInArrayState(
        setHasCustomPart,
        index,
        lcCountOverride > lcCount
      );

      lcNoAssignPartsSetters.forEach((setter, setterIndex) => {
        const lcSrcPart = source.midweek_meeting[`lc_part${setterIndex + 1}`];

        const lcSrcOverride = lcSrcPart.title.override.find(
          (record) => record.type === dataView
        )?.value;

        const lcSrcDefault =
          source.midweek_meeting[`lc_part${setterIndex + 1}`].title.default[
            lang
          ];

        const lcSrc = lcSrcOverride?.length > 0 ? lcSrcOverride : lcSrcDefault;

        if (setterIndex + 1 === 1 || setterIndex + 1 === 2) {
          changeValueInArrayState(
            isOverwriteLCPartsSetters[setterIndex],
            index,
            lcSrcOverride?.length > 0
          );
        }

        if (lcSrc?.length > 0) {
          const noAssign = sourcesCheckLCAssignments(lcSrc, lang);
          changeValueInArrayState(setter, index, noAssign);
        }
      });

      const lc3Src =
        source.midweek_meeting.lc_part3.title.find(
          (record) => record.type === dataView
        )?.value || '';

      if (lc3Src.length > 0) {
        const noAssign = sourcesCheckLCAssignments(lc3Src, lang);
        changeValueInArrayState(setLcNoAssignParts3, index, noAssign);
      }
    });
  }, [dataView, lang, selectedWeeks, sources]);

  const handleAddCustomLCPart = async (week: string) => {
    const source = sources.find((record) => record.weekOf === week);
    const lcCount = source.midweek_meeting.lc_count;
    const lcCountOverride = structuredClone(lcCount.override);

    let current = lcCountOverride.find((record) => record.type === dataView);
    if (!current) {
      lcCountOverride.push({ type: dataView, updatedAt: '', value: undefined });
      current = lcCountOverride.find((record) => record.type === dataView);
    }

    current.updatedAt = new Date().toISOString();
    current.value = lcCount.default[lang] + 1;

    const lcPartTitle = structuredClone(source.midweek_meeting.lc_part3.title);
    const currentTitle = lcPartTitle.find((record) => record.type === dataView);

    if (!currentTitle) {
      lcPartTitle.push({ type: dataView, updatedAt: '', value: '' });
    }

    const lcPartDesc = structuredClone(source.midweek_meeting.lc_part3.desc);
    const currentDesc = lcPartDesc.find((record) => record.type === dataView);

    if (!currentDesc) {
      lcPartDesc.push({ type: dataView, updatedAt: '', value: '' });
    }

    const lcPartTime = structuredClone(source.midweek_meeting.lc_part3.time);
    const currentTime = lcPartTime.find((record) => record.type === dataView);

    if (!currentTime) {
      lcPartTime.push({ type: dataView, updatedAt: '', value: undefined });
    }

    await dbSourcesUpdate(week, {
      'midweek_meeting.lc_count.override': lcCountOverride,
      'midweek_meeting.lc_part3.title': lcPartTitle,
      'midweek_meeting.lc_part3.desc': lcPartDesc,
      'midweek_meeting.lc_part3.time': lcPartTime,
    });
  };

  return {
    // General Settings
    currentYear,
    thisYearMonths,
    openingPrayerAuto,
    closingPrayerAuto,
    showDoublePerson,

    // Selected Month & Week Information
    monthName,
    selectedMonth,
    setSelectedMonth,
    selectedWeeks,
    weeksTypes,
    getWeekLocale,

    // Counts
    classCount,
    ayfCount,
    lcCount,

    // AYF Parts
    ayfParts1,
    ayfParts2,
    ayfParts3,
    ayfParts4,
    showAYFParts1Assistant,
    showAYFParts1DoublePerson,
    showAYFParts2Assistant,
    showAYFParts2DoublePerson,
    showAYFParts3Assistant,
    showAYFParts3DoublePerson,
    showAYFParts4Assistant,
    showAYFParts4DoublePerson,

    // LC Parts and Custom Parts
    lcNoAssignParts1,
    lcNoAssignParts2,
    lcNoAssignParts3,
    customPartEnabled,
    hasCustomPart,
    isOverwriteLCParts1,
    isOverwriteLCParts2,

    // Handlers
    handleToggleAYF,
    handleToggleLC,
    handleToggleTGW,

    // Toggles for Open State
    openAYF,
    openLC,
    openTGW,

    // AddCustomModalWindow
    openAddCustomModalWindow,
    setOpenAddCustomModalWindow,
    addCustomModalWindowWeek,
    setAddCustomModalWindowWeek,
    handleAddCustomLCPart,
  };
};

export default useMonthlyView;
