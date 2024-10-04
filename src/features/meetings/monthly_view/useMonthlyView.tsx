import { AssignmentCode } from '@definition/assignment';
import { Week } from '@definition/week_type';
import useAppTranslation from '@hooks/useAppTranslation';
import {
  sourcesCheckAYFExplainBeliefsAssignment,
  sourcesCheckLCAssignments,
} from '@services/app/sources';
import { JWLangState, monthNamesState } from '@states/app';
import { schedulesState } from '@states/schedules';
import {
  midweekMeetingClassCountState,
  midweekMeetingClosingPrayerAutoAssign,
  midweekMeetingOpeningPrayerAutoAssign,
  userDataViewState,
} from '@states/settings';
import { sourcesFormattedState, sourcesState } from '@states/sources';
import { SetStateAction, useEffect, useState } from 'react';
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

  const getWeeksByMonthAndYear = (year: number, month: number) => {
    let weeks = [];
    sourcesFormatted.forEach((srcYear) => {
      if (srcYear.value == year) {
        weeks = srcYear.months.find(
          (formattedMonth) => formattedMonth.value == month
        ).weeks;
      }
    });
    return weeks;
  };

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

  const monthName = monthNames[selectedMonth];

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
  }, [selectedMonth]);

  useEffect(() => {
    selectedWeeks.forEach((value, index) => {
      const source = sources.find((record) => record.weekOf === value);
      const schedule = schedules.find((record) => record.weekOf === value);

      const weekType = schedule.midweek_meeting.week_type.find(
        (record) => record.type === dataView
      );

      changeValueInArrayState(setWeeksTypes, index, weekType);

      changeValueInArrayState(
        setAyfCount,
        index,
        source.midweek_meeting.ayf_count[lang]
      );

      changeValueInArrayState(
        setAyfParts1,
        index,
        source.midweek_meeting.ayf_part1.type[lang]
      );

      if (
        source.midweek_meeting.ayf_part1.type[lang] ===
        AssignmentCode.MM_ExplainingBeliefs
      ) {
        changeValueInArrayState(
          setIsTalkAYFParts1,
          index,
          sourcesCheckAYFExplainBeliefsAssignment(
            source.midweek_meeting.ayf_part1.src[lang]
          )
        );
      }

      changeValueInArrayState(
        setAyfParts2,
        index,
        source.midweek_meeting.ayf_part2.type[lang]
      );

      if (
        source.midweek_meeting.ayf_part2.type[lang] ===
        AssignmentCode.MM_ExplainingBeliefs
      ) {
        changeValueInArrayState(
          setIsTalkAYFParts2,
          index,
          sourcesCheckAYFExplainBeliefsAssignment(
            source.midweek_meeting.ayf_part2.src[lang]
          )
        );
      }

      changeValueInArrayState(
        setAyfParts3,
        index,
        source.midweek_meeting.ayf_part3.type[lang]
      );

      if (
        source.midweek_meeting.ayf_part3.type[lang] ===
        AssignmentCode.MM_ExplainingBeliefs
      ) {
        changeValueInArrayState(
          setIsTalkAYFParts3,
          index,
          sourcesCheckAYFExplainBeliefsAssignment(
            source.midweek_meeting.ayf_part3.src[lang]
          )
        );
      }

      changeValueInArrayState(
        setAyfParts4,
        index,
        source.midweek_meeting.ayf_part4.type[lang]
      );

      if (
        source.midweek_meeting.ayf_part4.type[lang] ===
        AssignmentCode.MM_ExplainingBeliefs
      ) {
        changeValueInArrayState(
          setIsTalkAYFParts4,
          index,
          sourcesCheckAYFExplainBeliefsAssignment(
            source.midweek_meeting.ayf_part4.src[lang]
          )
        );
      }

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

      const lc1SrcOverride =
        source.midweek_meeting.lc_part1.title.override.find(
          (record) => record.type === dataView
        )?.value;
      const lc1SrcDefault = source.midweek_meeting.lc_part1.title.default[lang];
      const lc1Src =
        lc1SrcOverride?.length > 0 ? lc1SrcOverride : lc1SrcDefault;

      changeValueInArrayState(
        setIsOverwriteLCParts1,
        index,
        lc1SrcOverride?.length > 0
      );

      if (lc1Src?.length > 0) {
        const noAssign = sourcesCheckLCAssignments(lc1Src);
        changeValueInArrayState(setLcNoAssignParts1, index, noAssign);
      }

      const lc2SrcOverride =
        source.midweek_meeting.lc_part2.title.override.find(
          (record) => record.type === dataView
        )?.value;
      const lc2SrcDefault = source.midweek_meeting.lc_part2.title.default[lang];
      const lc2Src =
        lc2SrcOverride?.length > 0 ? lc2SrcOverride : lc2SrcDefault;

      changeValueInArrayState(
        setIsOverwriteLCParts2,
        index,
        lc2SrcOverride?.length > 0
      );

      if (lc2Src?.length > 0) {
        const noAssign = sourcesCheckLCAssignments(lc2Src);
        changeValueInArrayState(setLcNoAssignParts2, index, noAssign);
      }

      const lc3Src =
        source.midweek_meeting.lc_part3.title.find(
          (record) => record.type === dataView
        )?.value || '';

      if (lc3Src.length > 0) {
        const noAssign = sourcesCheckLCAssignments(lc3Src);
        changeValueInArrayState(setLcNoAssignParts3, index, noAssign);
      }
    });
  }, [selectedWeeks, schedules, sources, lang, dataView]);

  return {
    currentYear,
    monthName,
    getWeekLocale,
    selectedMonth,
    setSelectedMonth,
    selectedWeeks,
    weeksTypes,
    openingPrayerAuto,
    closingPrayerAuto,
    classCount,
    ayfCount,
    ayfParts1,
    ayfParts2,
    ayfParts3,
    ayfParts4,
    handleToggleAYF,
    handleToggleLC,
    handleToggleTGW,
    lcNoAssignParts1,
    lcNoAssignParts2,
    lcNoAssignParts3,
    customPartEnabled,
    openAYF,
    openLC,
    openTGW,
    monthNames,
    showDoublePerson,
    showAYFParts1Assistant,
    showAYFParts1DoublePerson,
    showAYFParts2Assistant,
    showAYFParts2DoublePerson,
    showAYFParts3Assistant,
    showAYFParts3DoublePerson,
    showAYFParts4Assistant,
    showAYFParts4DoublePerson,
    isOverwriteLCParts1,
    isOverwriteLCParts2,
    hasCustomPart,
    lcCount,
  };
};

export default useMonthlyView;
