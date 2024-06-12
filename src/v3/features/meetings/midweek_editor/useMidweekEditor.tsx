import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { schedulesState, selectedWeekState } from '@states/schedules';
import { JWLangState, monthNamesState } from '@states/app';
import { useAppTranslation } from '@hooks/index';
import { sourcesState } from '@states/sources';
import { midweekMeetingClassCountState, userDataViewState } from '@states/settings';
import { AssignmentCode } from '@definition/assignment';
import { sourcesCheckAYFExplainBeliefsAssignment, sourcesCheckLCAssignments } from '@services/app/sources';
import { Week } from '@definition/week_type';

const useMidweekEditor = () => {
  const { t } = useAppTranslation();

  const selectedWeek = useRecoilValue(selectedWeekState);
  const monthNames = useRecoilValue(monthNamesState);
  const sources = useRecoilValue(sourcesState);
  const lang = useRecoilValue(JWLangState);
  const dataView = useRecoilValue(userDataViewState);
  const classCount = useRecoilValue(midweekMeetingClassCountState);
  const schedules = useRecoilValue(schedulesState);

  const [isEdit, setIsEdit] = useState(false);

  const [weekDateLocale, setWeekDateLocale] = useState('');
  const [hasSource, setHasSource] = useState(false);
  const [weekType, setWeekType] = useState(Week.NORMAL);
  const [ayfCount, setAyfCount] = useState(1);
  const [ayfPart1, setAyfPart1] = useState(null);
  const [ayfPart2, setAyfPart2] = useState(null);
  const [ayfPart3, setAyfPart3] = useState(null);
  const [ayfPart4, setAyfPart4] = useState(null);
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
  const [isCustomLCPart2, setIsCustomLCPart2] = useState(false);
  const [openTGW, setOpenTGW] = useState(true);
  const [openAYF, setOpenAYF] = useState(true);
  const [openLC, setOpenLC] = useState(true);

  const showDoublePerson = classCount === 2 && weekType !== Week.CO_VISIT;

  const showAYFPart1Assistant =
    (ayfPart1 !== AssignmentCode.MM_ExplainingBeliefs &&
      ayfPart1 !== AssignmentCode.MM_Talk &&
      ayfPart1 !== AssignmentCode.MM_Discussion) ||
    (ayfPart1 === AssignmentCode.MM_ExplainingBeliefs && !isTalkAYFPart1);

  const showAYFPart2Assistant =
    (ayfPart2 !== AssignmentCode.MM_ExplainingBeliefs &&
      ayfPart2 !== AssignmentCode.MM_Talk &&
      ayfPart2 !== AssignmentCode.MM_Discussion) ||
    (ayfPart2 === AssignmentCode.MM_ExplainingBeliefs && !isTalkAYFPart2);

  const showAYFPart3Assistant =
    (ayfPart3 !== AssignmentCode.MM_ExplainingBeliefs &&
      ayfPart3 !== AssignmentCode.MM_Talk &&
      ayfPart3 !== AssignmentCode.MM_Discussion) ||
    (ayfPart3 === AssignmentCode.MM_ExplainingBeliefs && !isTalkAYFPart3);

  const showAYFPart4Assistant =
    (ayfPart4 !== AssignmentCode.MM_ExplainingBeliefs &&
      ayfPart4 !== AssignmentCode.MM_Talk &&
      ayfPart4 !== AssignmentCode.MM_Discussion) ||
    (ayfPart4 === AssignmentCode.MM_ExplainingBeliefs && !isTalkAYFPart4);

  const handleEditAssignments = () => setIsEdit(false);

  const handleEditParts = () => setIsEdit(true);

  const handleToggleTGW = () => setOpenTGW((prev) => !prev);

  const handleToggleAYF = () => setOpenAYF((prev) => !prev);

  const handleToggleLC = () => setOpenLC((prev) => !prev);

  const handleToggleOverwriteLCPart1 = () => setIsOverwriteLCPart1((prev) => !prev);

  const handleToggleOverwriteLCPart2 = () => setIsOverwriteLCPart2((prev) => !prev);

  useEffect(() => {
    if (selectedWeek.length > 0) {
      const weekDate = new Date(selectedWeek);
      const month = weekDate.getMonth();
      const date = weekDate.getDate();

      const monthName = monthNames[month];

      const weekDateLocale = t('tr_longDateNoYearLocale', { date, month: monthName });
      setWeekDateLocale(weekDateLocale);
    }
  }, [t, selectedWeek, monthNames]);

  useEffect(() => {
    if (selectedWeek.length > 0) {
      const source = sources.find((record) => record.weekOf === selectedWeek);
      const schedule = schedules.find((record) => record.weekOf === selectedWeek);

      const weekDate = source.midweek_meeting.week_date_locale[lang];

      if (weekDate) {
        setHasSource(true);

        const weekType = schedule.week_type.find((record) => record.type === dataView);
        setWeekType(weekType.value);

        setAyfCount(source.midweek_meeting.ayf_count[lang]);
        setAyfPart1(source.midweek_meeting.ayf_part1.type[lang]);

        if (source.midweek_meeting.ayf_part1.type[lang] === AssignmentCode.MM_ExplainingBeliefs) {
          setIsTalkAYFPart1(sourcesCheckAYFExplainBeliefsAssignment(source.midweek_meeting.ayf_part1.src[lang]));
        }

        setAyfPart2(source.midweek_meeting.ayf_part2.type[lang]);

        if (source.midweek_meeting.ayf_part2.type[lang] === AssignmentCode.MM_ExplainingBeliefs) {
          setIsTalkAYFPart2(sourcesCheckAYFExplainBeliefsAssignment(source.midweek_meeting.ayf_part2.src[lang]));
        }

        setAyfPart3(source.midweek_meeting.ayf_part3.type[lang]);

        if (source.midweek_meeting.ayf_part3.type[lang] === AssignmentCode.MM_ExplainingBeliefs) {
          setIsTalkAYFPart3(sourcesCheckAYFExplainBeliefsAssignment(source.midweek_meeting.ayf_part3.src[lang]));
        }

        setAyfPart4(source.midweek_meeting.ayf_part4.type[lang]);

        if (source.midweek_meeting.ayf_part4.type[lang] === AssignmentCode.MM_ExplainingBeliefs) {
          setIsTalkAYFPart4(sourcesCheckAYFExplainBeliefsAssignment(source.midweek_meeting.ayf_part4.src[lang]));
        }

        const lcCountOverride =
          source.midweek_meeting.lc_count.override.find((record) => record.type === dataView)?.value || 0;
        const lcCountDefault = source.midweek_meeting.lc_count.default[lang];
        const lcCount = lcCountOverride > 0 ? lcCountOverride : lcCountDefault;
        setLcCount(lcCount);
        setCustomPartEnabled(lcCountOverride < lcCount + 1);
        setIsCustomLCPart2(lcCountDefault === 1 && lcCountOverride > lcCountDefault);

        const lc1SrcOverride = source.midweek_meeting.lc_part1.title.override.find(
          (record) => record.type === dataView
        )?.value;
        const lc1SrcDefault = source.midweek_meeting.lc_part1.title.default[lang];
        const lc1Src = lc1SrcOverride?.length > 0 ? lc1SrcOverride : lc1SrcDefault;

        if (lc1Src?.length > 0) {
          const noAssign = sourcesCheckLCAssignments(lc1Src);
          setLcNoAssignPart1(noAssign);
        }

        const lc2SrcOverride = source.midweek_meeting.lc_part2.title.override.find(
          (record) => record.type === dataView
        )?.value;
        const lc2SrcDefault = source.midweek_meeting.lc_part2.title.default[lang];
        const lc2Src = lc2SrcOverride?.length > 0 ? lc2SrcOverride : lc2SrcDefault;

        if (lc2Src?.length > 0) {
          const noAssign = sourcesCheckLCAssignments(lc2Src);
          setLcNoAssignPart2(noAssign);
        }

        const lc3Src = source.midweek_meeting.lc_part3.title.find((record) => record.type === dataView)?.value || '';

        if (lc3Src.length > 0) {
          const noAssign = sourcesCheckLCAssignments(lc3Src);
          setLcNoAssignPart3(noAssign);
        }
      } else {
        setHasSource(false);
      }
    }
  }, [selectedWeek, sources, lang, dataView, schedules]);

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
    isCustomLCPart2,
    handleToggleOverwriteLCPart1,
    handleToggleOverwriteLCPart2,
    handleToggleTGW,
    handleToggleAYF,
    handleToggleLC,
    openTGW,
    openAYF,
    openLC,
  };
};

export default useMidweekEditor;
