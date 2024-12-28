import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { schedulesState, selectedWeekState } from '@states/schedules';
import { monthNamesState } from '@states/app';
import { useAppTranslation } from '@hooks/index';
import { sourcesFormattedState, sourcesState } from '@states/sources';
import {
  JWLangLocaleState,
  JWLangState,
  midweekMeetingClassCountState,
  midweekMeetingClosingPrayerAutoAssign,
  midweekMeetingOpeningPrayerAutoAssign,
  userDataViewState,
} from '@states/settings';
import { AssignmentCode } from '@definition/assignment';
import {
  sourcesCheckAYFExplainBeliefsAssignment,
  sourcesCheckLCAssignments,
} from '@services/app/sources';
import { Week } from '@definition/week_type';
import { dbSourcesUpdate } from '@services/dexie/sources';

const useMidweekEditor = () => {
  const { t } = useAppTranslation();

  const [selectedWeek, setSelectedWeek] = useRecoilState(selectedWeekState);
  const weeksSource = useRecoilValue(sourcesFormattedState);
  const monthNames = useRecoilValue(monthNamesState);
  const sources = useRecoilValue(sourcesState);
  const lang = useRecoilValue(JWLangState);
  const dataView = useRecoilValue(userDataViewState);
  const classCount = useRecoilValue(midweekMeetingClassCountState);
  const schedules = useRecoilValue(schedulesState);
  const sourceLocale = useRecoilValue(JWLangLocaleState);
  const openingPrayerAuto = useRecoilValue(
    midweekMeetingOpeningPrayerAutoAssign
  );
  const closingPrayerAuto = useRecoilValue(
    midweekMeetingClosingPrayerAutoAssign
  );

  const [isEdit, setIsEdit] = useState(false);

  const [weekDateLocale, setWeekDateLocale] = useState('');
  const [hasSource, setHasSource] = useState(false);
  const [weekType, setWeekType] = useState(Week.NORMAL);
  const [ayfCount, setAyfCount] = useState(1);
  const [ayfPart1, setAyfPart1] = useState<AssignmentCode>(null);
  const [ayfPart2, setAyfPart2] = useState<AssignmentCode>(null);
  const [ayfPart3, setAyfPart3] = useState<AssignmentCode>(null);
  const [ayfPart4, setAyfPart4] = useState<AssignmentCode>(null);
  const [isTalkAYFPart1, setIsTalkAYFPart1] = useState(false);
  const [isTalkAYFPart2, setIsTalkAYFPart2] = useState(false);
  const [isTalkAYFPart3, setIsTalkAYFPart3] = useState(false);
  const [isTalkAYFPart4, setIsTalkAYFPart4] = useState(false);
  const [lcCount, setLcCount] = useState(1);
  const [lcNoAssignPart1, setLcNoAssignPart1] = useState(false);
  const [lcNoAssignPart2, setLcNoAssignPart2] = useState(false);
  const [lcNoAssignPart3, setLcNoAssignPart3] = useState(false);
  const [customPartEnabled, setCustomPartEnabled] = useState(true);
  const [isOverwriteLCPart1, setIsOverwriteLCPart1] = useState(false);
  const [isOverwriteLCPart2, setIsOverwriteLCPart2] = useState(false);
  const [openTGW, setOpenTGW] = useState(true);
  const [openAYF, setOpenAYF] = useState(true);
  const [openLC, setOpenLC] = useState(true);
  const [hasCustomPart, setHasCustomPart] = useState(false);
  const [clearAll, setClearAll] = useState(false);
  const [showWeekArrows, setShowWeeksArrows] = useState({
    back: false,
    next: false,
  });

  const currentYear =
    selectedWeek.length > 0
      ? new Date(selectedWeek).getFullYear()
      : new Date().getFullYear();

  const showDoublePerson = classCount === 2 && weekType !== Week.CO_VISIT;

  const showAYFPart1Assistant =
    (ayfPart1 !== AssignmentCode.MM_ExplainingBeliefs &&
      ayfPart1 !== AssignmentCode.MM_Talk &&
      ayfPart1 !== AssignmentCode.MM_Discussion) ||
    (ayfPart1 === AssignmentCode.MM_ExplainingBeliefs && !isTalkAYFPart1);

  const showAYFPart1DoublePerson =
    showDoublePerson && ayfPart1 !== AssignmentCode.MM_Discussion;

  const showAYFPart2Assistant =
    (ayfPart2 !== AssignmentCode.MM_ExplainingBeliefs &&
      ayfPart2 !== AssignmentCode.MM_Talk &&
      ayfPart2 !== AssignmentCode.MM_Discussion) ||
    (ayfPart2 === AssignmentCode.MM_ExplainingBeliefs && !isTalkAYFPart2);

  const showAYFPart2DoublePerson =
    showDoublePerson && ayfPart2 !== AssignmentCode.MM_Discussion;

  const showAYFPart3Assistant =
    (ayfPart3 !== AssignmentCode.MM_ExplainingBeliefs &&
      ayfPart3 !== AssignmentCode.MM_Talk &&
      ayfPart3 !== AssignmentCode.MM_Discussion) ||
    (ayfPart3 === AssignmentCode.MM_ExplainingBeliefs && !isTalkAYFPart3);

  const showAYFPart3DoublePerson =
    showDoublePerson && ayfPart3 !== AssignmentCode.MM_Discussion;

  const showAYFPart4Assistant =
    (ayfPart4 !== AssignmentCode.MM_ExplainingBeliefs &&
      ayfPart4 !== AssignmentCode.MM_Talk &&
      ayfPart4 !== AssignmentCode.MM_Discussion) ||
    (ayfPart4 === AssignmentCode.MM_ExplainingBeliefs && !isTalkAYFPart4);

  const showAYFPart4DoublePerson =
    showDoublePerson && ayfPart4 !== AssignmentCode.MM_Discussion;

  const handleEditAssignments = () => setIsEdit(false);

  const handleEditParts = () => setIsEdit(true);

  const handleToggleTGW = () => setOpenTGW((prev) => !prev);

  const handleToggleAYF = () => setOpenAYF((prev) => !prev);

  const handleToggleLC = () => setOpenLC((prev) => !prev);

  const handleToggleOverwriteLCPart1 = async () => {
    const newValue = !isOverwriteLCPart1;

    const source = sources.find((record) => record.weekOf === selectedWeek);

    const lcPartTitle = structuredClone(
      source.midweek_meeting.lc_part1.title.override
    );
    const currentTitle = lcPartTitle.find((record) => record.type === dataView);

    if (!currentTitle) {
      lcPartTitle.push({ type: dataView, updatedAt: '', value: '' });
    } else {
      currentTitle.value = '';
      currentTitle.updatedAt = new Date().toISOString();
    }

    await dbSourcesUpdate(selectedWeek, {
      'midweek_meeting.lc_part1.title.override': lcPartTitle,
    });

    const lcPartTime = structuredClone(
      source.midweek_meeting.lc_part1.time.override
    );
    const currentTime = lcPartTime.find((record) => record.type === dataView);

    if (!currentTime) {
      lcPartTime.push({ type: dataView, updatedAt: '', value: undefined });
    } else {
      currentTime.updatedAt = new Date().toISOString();
      currentTime.value = undefined;
    }

    await dbSourcesUpdate(selectedWeek, {
      'midweek_meeting.lc_part1.time.override': lcPartTime,
    });

    const lcPartDesc = structuredClone(
      source.midweek_meeting.lc_part1.desc.override
    );
    const currentDesc = lcPartDesc.find((record) => record.type === dataView);

    if (!currentDesc) {
      lcPartDesc.push({ type: dataView, updatedAt: '', value: '' });
    } else {
      currentDesc.updatedAt = new Date().toISOString();
      currentDesc.value = '';
    }

    await dbSourcesUpdate(selectedWeek, {
      'midweek_meeting.lc_part1.desc.override': lcPartDesc,
    });

    setIsOverwriteLCPart1(newValue);
  };

  const handleToggleOverwriteLCPart2 = async () => {
    const newValue = !isOverwriteLCPart2;

    const source = sources.find((record) => record.weekOf === selectedWeek);

    const lcPartTitle = structuredClone(
      source.midweek_meeting.lc_part2.title.override
    );
    const currentTitle = lcPartTitle.find((record) => record.type === dataView);

    if (!currentTitle) {
      lcPartTitle.push({ type: dataView, updatedAt: '', value: '' });
    } else {
      currentTitle.updatedAt = new Date().toISOString();
      currentTitle.value = '';
    }
    await dbSourcesUpdate(selectedWeek, {
      'midweek_meeting.lc_part2.title.override': lcPartTitle,
    });

    const lcPartTime = structuredClone(
      source.midweek_meeting.lc_part2.time.override
    );
    const currentTime = lcPartTime.find((record) => record.type === dataView);

    if (!currentTime) {
      lcPartTime.push({ type: dataView, updatedAt: '', value: undefined });
    } else {
      currentTime.updatedAt = new Date().toISOString();
      currentTime.value = undefined;
    }
    await dbSourcesUpdate(selectedWeek, {
      'midweek_meeting.lc_part2.time.override': lcPartTime,
    });

    const lcPartDesc = structuredClone(
      source.midweek_meeting.lc_part2.desc.override
    );
    const currentDesc = lcPartDesc.find((record) => record.type === dataView);

    if (!currentDesc) {
      lcPartDesc.push({ type: dataView, updatedAt: '', value: '' });
    } else {
      currentDesc.updatedAt = new Date().toISOString();
      currentDesc.value = '';
    }
    await dbSourcesUpdate(selectedWeek, {
      'midweek_meeting.lc_part2.desc.override': lcPartDesc,
    });

    setIsOverwriteLCPart2(newValue);
  };

  const handleAddCustomLCPart = async () => {
    const source = sources.find((record) => record.weekOf === selectedWeek);
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

    await dbSourcesUpdate(selectedWeek, {
      'midweek_meeting.lc_count.override': lcCountOverride,
      'midweek_meeting.lc_part3.title': lcPartTitle,
      'midweek_meeting.lc_part3.desc': lcPartDesc,
      'midweek_meeting.lc_part3.time': lcPartTime,
    });
  };

  const handleDeleteCustomLCPart = async () => {
    const source = sources.find((record) => record.weekOf === selectedWeek);
    const lcCountOverride = structuredClone(
      source.midweek_meeting.lc_count.override
    );

    const currentCount = lcCountOverride.find(
      (record) => record.type === dataView
    );
    currentCount.updatedAt = new Date().toISOString();
    currentCount.value = undefined;

    const lcPartTitle = structuredClone(source.midweek_meeting.lc_part3.title);
    const currentTitle = lcPartTitle.find((record) => record.type === dataView);
    currentTitle.updatedAt = new Date().toISOString();
    currentTitle.value = '';

    const lcPartDesc = structuredClone(source.midweek_meeting.lc_part3.desc);
    const currentDesc = lcPartDesc.find((record) => record.type === dataView);
    currentDesc.updatedAt = new Date().toISOString();
    currentDesc.value = '';

    const lcPartTime = structuredClone(source.midweek_meeting.lc_part3.time);
    const currentTime = lcPartTime.find((record) => record.type === dataView);
    currentTime.updatedAt = new Date().toISOString();
    currentTime.value = undefined;

    await dbSourcesUpdate(selectedWeek, {
      'midweek_meeting.lc_count.override': lcCountOverride,
      'midweek_meeting.lc_part3.title': lcPartTitle,
      'midweek_meeting.lc_part3.desc': lcPartDesc,
      'midweek_meeting.lc_part3.time': lcPartTime,
    });
  };

  const handleOpenClearAll = () => setClearAll(true);

  const handleCloseClearAll = () => setClearAll(false);

  const getWeeksInYear = (yearValue) => {
    const yearData = weeksSource.find((year) => year.value === yearValue);
    return yearData
      ? yearData.months.flatMap((month) => month.weeks).sort()
      : [];
  };

  const handleChangeWeekBack = () => {
    const weeksInYear = getWeeksInYear(currentYear);
    const selectedWeekIndex = weeksInYear.indexOf(selectedWeek);

    if (selectedWeekIndex > 0) {
      setSelectedWeek(weeksInYear[selectedWeekIndex - 1]);
    }
  };

  const handleChangeWeekNext = () => {
    const weeksInYear = getWeeksInYear(currentYear);
    const selectedWeekIndex = weeksInYear.indexOf(selectedWeek);

    if (selectedWeekIndex < weeksInYear.length - 1) {
      setSelectedWeek(weeksInYear[selectedWeekIndex + 1]);
    }
  };

  useEffect(() => {
    if (selectedWeek.length > 0) {
      const weekDate = new Date(selectedWeek);
      const month = weekDate.getMonth();
      const date = weekDate.getDate();

      const monthName = monthNames[month];

      const weekDateLocale = t('tr_longDateNoYearLocale', {
        date,
        month: monthName,
      });
      setWeekDateLocale(weekDateLocale);
    }
  }, [t, selectedWeek, monthNames]);

  useEffect(() => {
    setIsOverwriteLCPart1(false);
    setIsOverwriteLCPart2(false);

    if (selectedWeek.length > 0) {
      const source = sources.find((record) => record.weekOf === selectedWeek);
      const schedule = schedules.find(
        (record) => record.weekOf === selectedWeek
      );

      const weekDate = source.midweek_meeting.week_date_locale[lang];

      if (weekDate) {
        setHasSource(true);

        const weekType = schedule.midweek_meeting.week_type.find(
          (record) => record.type === dataView
        );
        setWeekType(weekType.value);

        setAyfCount(source.midweek_meeting.ayf_count[lang]);
        setAyfPart1(source.midweek_meeting.ayf_part1.type[lang]);

        if (
          source.midweek_meeting.ayf_part1.type[lang] ===
          AssignmentCode.MM_ExplainingBeliefs
        ) {
          setIsTalkAYFPart1(
            sourcesCheckAYFExplainBeliefsAssignment(
              source.midweek_meeting.ayf_part1.src[lang],
              sourceLocale
            )
          );
        }

        setAyfPart2(source.midweek_meeting.ayf_part2.type[lang]);

        if (
          source.midweek_meeting.ayf_part2.type[lang] ===
          AssignmentCode.MM_ExplainingBeliefs
        ) {
          setIsTalkAYFPart2(
            sourcesCheckAYFExplainBeliefsAssignment(
              source.midweek_meeting.ayf_part2.src[lang],
              sourceLocale
            )
          );
        }

        setAyfPart3(source.midweek_meeting.ayf_part3.type[lang]);

        if (
          source.midweek_meeting.ayf_part3.type[lang] ===
          AssignmentCode.MM_ExplainingBeliefs
        ) {
          setIsTalkAYFPart3(
            sourcesCheckAYFExplainBeliefsAssignment(
              source.midweek_meeting.ayf_part3.src[lang],
              sourceLocale
            )
          );
        }

        setAyfPart4(source.midweek_meeting.ayf_part4.type[lang]);

        if (
          source.midweek_meeting.ayf_part4.type[lang] ===
          AssignmentCode.MM_ExplainingBeliefs
        ) {
          setIsTalkAYFPart4(
            sourcesCheckAYFExplainBeliefsAssignment(
              source.midweek_meeting.ayf_part4.src[lang],
              sourceLocale
            )
          );
        }

        const lcCountOverride =
          source.midweek_meeting.lc_count.override.find(
            (record) => record.type === dataView
          )?.value || 0;
        const lcCount = source.midweek_meeting.lc_count.default[lang];
        setLcCount(lcCount);
        setCustomPartEnabled(lcCountOverride < lcCount + 1);
        setHasCustomPart(lcCountOverride > lcCount);

        const lc1SrcOverride =
          source.midweek_meeting.lc_part1.title.override.find(
            (record) => record.type === dataView
          )?.value;
        const lc1SrcDefault =
          source.midweek_meeting.lc_part1.title.default[lang];
        const lc1Src =
          lc1SrcOverride?.length > 0 ? lc1SrcOverride : lc1SrcDefault;
        setIsOverwriteLCPart1(lc1SrcOverride?.length > 0);

        if (lc1Src?.length > 0) {
          const noAssign = sourcesCheckLCAssignments(lc1Src, sourceLocale);
          setLcNoAssignPart1(noAssign);
        }

        const lc2SrcOverride =
          source.midweek_meeting.lc_part2.title.override.find(
            (record) => record.type === dataView
          )?.value;
        const lc2SrcDefault =
          source.midweek_meeting.lc_part2.title.default[lang];
        const lc2Src =
          lc2SrcOverride?.length > 0 ? lc2SrcOverride : lc2SrcDefault;
        setIsOverwriteLCPart2(lc2SrcOverride?.length > 0);

        if (lc2Src?.length > 0) {
          const noAssign = sourcesCheckLCAssignments(lc2Src, sourceLocale);
          setLcNoAssignPart2(noAssign);
        }

        const lc3Src =
          source.midweek_meeting.lc_part3.title.find(
            (record) => record.type === dataView
          )?.value || '';

        if (lc3Src.length > 0) {
          const noAssign = sourcesCheckLCAssignments(lc3Src, sourceLocale);
          setLcNoAssignPart3(noAssign);
        }
      } else {
        setHasSource(false);
      }
    }
  }, [selectedWeek, sources, lang, dataView, schedules, sourceLocale]);

  useEffect(() => {
    const weeksInYear = getWeeksInYear(currentYear);

    const selectedWeekIndex = weeksInYear.indexOf(selectedWeek);

    if (selectedWeekIndex !== -1) {
      setShowWeeksArrows({
        back: selectedWeekIndex !== 0,
        next: selectedWeekIndex + 1 !== weeksInYear.length,
      });
    }
  }, [currentYear, getWeeksInYear, selectedWeek]);

  return {
    isEdit,
    handleEditAssignments,
    handleEditParts,
    weekDateLocale,
    selectedWeek,
    hasSource,
    ayfCount,
    lcCount,
    showDoublePerson,
    ayfPart1,
    ayfPart2,
    ayfPart3,
    ayfPart4,
    showAYFPart1Assistant,
    showAYFPart2Assistant,
    showAYFPart3Assistant,
    showAYFPart4Assistant,
    lcNoAssignPart1,
    lcNoAssignPart2,
    lcNoAssignPart3,
    weekType,
    customPartEnabled,
    isOverwriteLCPart1,
    isOverwriteLCPart2,
    handleToggleOverwriteLCPart1,
    handleToggleOverwriteLCPart2,
    handleToggleTGW,
    handleToggleAYF,
    handleToggleLC,
    openTGW,
    openAYF,
    openLC,
    handleAddCustomLCPart,
    hasCustomPart,
    handleDeleteCustomLCPart,
    clearAll,
    handleOpenClearAll,
    handleCloseClearAll,
    openingPrayerAuto,
    closingPrayerAuto,
    showAYFPart1DoublePerson,
    showAYFPart2DoublePerson,
    showAYFPart3DoublePerson,
    showAYFPart4DoublePerson,
    sourceLocale,
    handleChangeWeekBack,
    handleChangeWeekNext,
    showWeekArrows,
  };
};

export default useMidweekEditor;
