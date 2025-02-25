import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { AssignmentCode, AssignmentFieldType } from '@definition/assignment';
import { LivingAsChristiansType } from '@definition/sources';
import { sourcesState } from '@states/sources';
import {
  JWLangLocaleState,
  JWLangState,
  userDataViewState,
} from '@states/settings';
import { BrotherAssignmentProps } from './index.types';
import { sourcesCheckLCAssignments } from '@services/app/sources';

const useBrotherAssignment = ({
  type,
  selectedWeek,
}: BrotherAssignmentProps) => {
  const sources = useRecoilValue(sourcesState);
  const dataView = useRecoilValue(userDataViewState);
  const lang = useRecoilValue(JWLangState);
  const sourceLocale = useRecoilValue(JWLangLocaleState);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === selectedWeek);
  }, [selectedWeek, sources]);

  const meetingPartColor = useMemo(() => {
    if (type.includes('tgw_')) {
      return 'var(--treasures-from-gods-word)';
    }

    if (type.includes('lc_')) {
      return 'var(--living-as-christians)';
    }
  }, [type]);

  const assignmentType: AssignmentCode = useMemo(() => {
    switch (type) {
      case 'tgw_talk':
        return AssignmentCode.MM_TGWTalk;
      case 'tgw_gems':
        return AssignmentCode.MM_TGWGems;
      case 'lc_part1':
        return AssignmentCode.MM_LCPart;
      case 'lc_part2':
        return AssignmentCode.MM_LCPart;
      case 'lc_part3':
        return AssignmentCode.MM_LCPart;
      default:
        break;
    }
  }, [type]);

  const assignment: AssignmentFieldType = useMemo(() => {
    switch (type) {
      case 'tgw_talk':
        return 'MM_TGWTalk';
      case 'tgw_gems':
        return 'MM_TGWTalk';
      case 'lc_part1':
        return 'MM_LCPart1';
      case 'lc_part2':
        return 'MM_LCPart2';
      case 'lc_part3':
        return 'MM_LCPart3';
      default:
        break;
    }
  }, [type]);

  const partDuration = useMemo(() => {
    switch (type) {
      case 'tgw_talk':
        return 10;
      case 'tgw_gems':
        return 10;
      case 'lc_part1':
        return 15;
      case 'lc_part2':
        return 15;
      case 'lc_part3':
        return 15;
      default:
        break;
    }
  }, [type]);

  const enableAssignment = useMemo(() => {
    if (type !== 'lc_part1' && type !== 'lc_part2' && type !== 'lc_part3') {
      return true;
    }

    if (type === 'lc_part1' || type === 'lc_part2') {
      const lcPart = source.midweek_meeting[type] as LivingAsChristiansType;

      const lcSrcOverride = lcPart.title.override.find(
        (record) => record.type === dataView
      )?.value;

      const lcSrcDefault = lcPart.title.default[lang];

      const lcSrc = lcSrcOverride?.length > 0 ? lcSrcOverride : lcSrcDefault;

      if (lcSrc?.length > 0) {
        return !sourcesCheckLCAssignments(lcSrc, sourceLocale);
      }
    }

    if (type === 'lc_part3') {
      const lcPart = source.midweek_meeting.lc_part3;

      const lcSrc =
        lcPart.title.find((record) => record.type === dataView)?.value || '';

      if (lcSrc.length > 0) {
        return !sourcesCheckLCAssignments(lcSrc, sourceLocale);
      }
    }
  }, [type, source, dataView, lang, sourceLocale]);

  return {
    meetingPartColor,
    assignmentType,
    assignment,
    partDuration,
    enableAssignment,
  };
};

export default useBrotherAssignment;
