import { AssignmentCode } from '@definition/assignment';
import { Week } from '@definition/week_type';
import { addDays } from '@utils/date';
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
  midweekMeetingClosingPrayerLinkedState,
  midweekMeetingOpeningPrayerLinkedState,
  midweekMeetingWeekdayState,
  userDataViewState,
} from '@states/settings';
import { sourcesState } from '@states/sources';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';

const useMonthlyView = () => {
  const { t } = useAppTranslation();

  const monthNames = useAtomValue(monthNamesState);
  const sources = useAtomValue(sourcesState);
  const schedules = useAtomValue(schedulesState);
  const dataView = useAtomValue(userDataViewState);
  const classCount = useAtomValue(midweekMeetingClassCountState);
  const meetingWeekday = useAtomValue(midweekMeetingWeekdayState);
  const lang = useAtomValue(JWLangState);
  const openingPrayerLinked = useAtomValue(
    midweekMeetingOpeningPrayerLinkedState
  );
  const closingPrayerLinked = useAtomValue(
    midweekMeetingClosingPrayerLinkedState
  );

  const currentYear = new Date().getFullYear().toString();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const [openTGW, setOpenTGW] = useState(true);
  const [openAYF, setOpenAYF] = useState(true);
  const [openLC, setOpenLC] = useState(true);

  const [openAddCustomModalWindow, setOpenAddCustomModalWindow] =
    useState(false);
  const [addCustomModalWindowWeek, setAddCustomModalWindowWeek] =
    useState(null);

  // Derive which month indices (0-11) have published material for the current year.
  // IMPORTANT: uses the actual meeting date (weekOf + congregation weekday offset)
  // so that e.g. weekOf=2026/08/31 with Thursday meeting correctly shows under
  // September (meeting date = Sept 3), not August. Mirrors schedulesGetMeetingDate.
  const availableMonthIndices = useMemo(() => {
    const set = new Set<number>();
    sources.forEach((s) => {
      if (
        s.weekOf.startsWith(currentYear) &&
        s.midweek_meeting?.week_date_locale?.[lang]?.length > 0
      ) {
        const meetingDate = addDays(s.weekOf, meetingWeekday);
        set.add(meetingDate.getMonth());
      }
    });
    return set;
  }, [sources, currentYear, lang, meetingWeekday]);

  // Index maps for O(1) lookups instead of repeated .find() (js-index-maps rule).
  const sourcesByWeek = useMemo(
    () => new Map(sources.map((s) => [s.weekOf, s])),
    [sources]
  );

  const schedulesByWeek = useMemo(
    () => new Map(schedules.map((s) => [s.weekOf, s])),
    [schedules]
  );

  // Derive weeks for the selected month (rerender-derived-state-no-effect rule).
  const selectedWeeks = useMemo(() => {
    return sources
      .filter((s) => {
        if (!s.midweek_meeting?.week_date_locale?.[lang]?.length) return false;
        const meetingDate = addDays(s.weekOf, meetingWeekday);
        return (
          meetingDate.getFullYear().toString() === currentYear &&
          meetingDate.getMonth() === selectedMonth
        );
      })
      .map((s) => s.weekOf)
      .sort();
  }, [currentYear, selectedMonth, sources, lang, meetingWeekday]);

  // Derive week types from schedules.
  const weeksTypes = useMemo(() => {
    return selectedWeeks.map((weekOf) => {
      const schedule = schedulesByWeek.get(weekOf);
      const weekType = schedule?.midweek_meeting?.week_type?.find(
          (record) => record.type === dataView
        );
      return weekType || { type: dataView, value: Week.NORMAL, updatedAt: '' };
    });
  }, [selectedWeeks, schedulesByWeek, dataView]);

  // Derive AYF data from sources.
  const {
    ayfCount,
    ayfParts1,
    ayfParts2,
    ayfParts3,
    ayfParts4,
    isTalkAYFParts1,
    isTalkAYFParts2,
    isTalkAYFParts3,
    isTalkAYFParts4,
  } = useMemo(() => {
    const counts: number[] = [];
    const parts: AssignmentCode[][] = [[], [], [], []];
    const isTalk: boolean[][] = [[], [], [], []];

    for (const weekOf of selectedWeeks) {
      const source = sourcesByWeek.get(weekOf);

      counts.push(source?.midweek_meeting?.ayf_count[lang] || 3);

      for (let i = 0; i < 4; i++) {
        const ayfPart = source?.midweek_meeting[`ayf_part${i + 1}`];

        let partType = ayfPart?.type[lang];
        if (!partType || partType === 0) {
          partType = AssignmentCode.MM_StartingConversation;
        }

        parts[i].push(partType);
        isTalk[i].push(
          partType === AssignmentCode.MM_ExplainingBeliefs
            ? sourcesCheckAYFExplainBeliefsAssignment(
                ayfPart?.src[lang],
                lang
              )
            : false
        );
      }
    }

    return {
      ayfCount: counts,
      ayfParts1: parts[0],
      ayfParts2: parts[1],
      ayfParts3: parts[2],
      ayfParts4: parts[3],
      isTalkAYFParts1: isTalk[0],
      isTalkAYFParts2: isTalk[1],
      isTalkAYFParts3: isTalk[2],
      isTalkAYFParts4: isTalk[3],
    };
  }, [selectedWeeks, sourcesByWeek, lang]);

  // Derive LC data from sources.
  const {
    lcCount,
    customPartEnabled,
    hasCustomPart,
    lcNoAssignParts1,
    lcNoAssignParts2,
    lcNoAssignParts3,
    isOverwriteLCParts1,
    isOverwriteLCParts2,
  } = useMemo(() => {
    const counts: number[] = [];
    const customEnabled: boolean[] = [];
    const hasCustom: boolean[] = [];
    const lcNoAssign: boolean[][] = [[], [], []];
    const isOverwrite: boolean[][] = [[], []];

    for (const weekOf of selectedWeeks) {
      const source = sourcesByWeek.get(weekOf);

      const lcCountOverride =
        source?.midweek_meeting?.lc_count?.override?.find(
          (record) => record.type === dataView
        )?.value || 0;

      const lcCountVal =
        source?.midweek_meeting?.lc_count?.default?.[lang] || 0;

      counts.push(lcCountVal);
      customEnabled.push(lcCountOverride < lcCountVal + 1);
      hasCustom.push(lcCountOverride > lcCountVal);

      for (let i = 0; i < 2; i++) {
        const lcSrcPart =
          source?.midweek_meeting?.[`lc_part${i + 1}`];

        const lcSrcOverride = lcSrcPart?.title?.override?.find(
          (record) => record.type === dataView
        )?.value;

        const lcSrcDefault =
          source?.midweek_meeting?.[`lc_part${i + 1}`]?.title?.default?.[lang];

        const lcSrc =
          lcSrcOverride?.length > 0 ? lcSrcOverride : lcSrcDefault;

        isOverwrite[i].push(lcSrcOverride?.length > 0);
        lcNoAssign[i].push(
          lcSrc?.length > 0
            ? sourcesCheckLCAssignments(lcSrc, lang)
            : false
        );
      }

      // LC part 3
      const lc3Src =
        source?.midweek_meeting?.lc_part3?.title?.find(
          (record) => record.type === dataView
        )?.value || '';

      lcNoAssign[2].push(
        lc3Src.length > 0
          ? sourcesCheckLCAssignments(lc3Src, lang)
          : false
      );
    }

    return {
      lcCount: counts,
      customPartEnabled: customEnabled,
      hasCustomPart: hasCustom,
      lcNoAssignParts1: lcNoAssign[0],
      lcNoAssignParts2: lcNoAssign[1],
      lcNoAssignParts3: lcNoAssign[2],
      isOverwriteLCParts1: isOverwrite[0],
      isOverwriteLCParts2: isOverwrite[1],
    };
  }, [selectedWeeks, sourcesByWeek, dataView, lang]);

  const getWeekLocale = useCallback(
    (date: number, month: string) => {
      return t('tr_longDateNoYearLocale', {
        date,
        month,
      });
    },
    [t]
  );

  const showDoublePerson = weeksTypes.map((week) => {
    return week.value !== Week.CO_VISIT;
  });

  const showAYFPartAssistant = (
    ayfPart: AssignmentCode[],
    isTalkAYFPart: boolean[]
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

  // Clamp selectedMonth to an available month when the current selection has no data.
  // This prevents rendering an empty month and jumps to the closest available month.
  useEffect(() => {
    if (availableMonthIndices.size > 0 && !availableMonthIndices.has(selectedMonth)) {
      setSelectedMonth(Math.max(...Array.from(availableMonthIndices)));
    }
  }, [availableMonthIndices, selectedMonth]);

  const handleAddCustomLCPart = async (week: string) => {
    const source = sourcesByWeek.get(week);
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
    monthNames,
    availableMonthIndices,
    openingPrayerLinked,
    closingPrayerLinked,
    showDoublePerson,
    meetingWeekday,

    // Selected Month & Week Information
    selectedMonth,
    setSelectedMonth,
    selectedWeeks,
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
