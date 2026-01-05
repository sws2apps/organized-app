import { AssignmentCode } from '@definition/assignment';

export interface AssignmentItem {
  code: AssignmentCode;
  nameKey: string;
  borderTop?: boolean;
}

export interface AssignmentSection {
  id: string;
  headerKey: string;
  items: AssignmentItem[];
}

export const ASSIGNMENT_SECTIONS: AssignmentSection[] = [
  {
    id: 'midweekMeeting',
    headerKey: 'tr_midweekMeeting',
    items: [
      { code: AssignmentCode.MM_Chairman, nameKey: 'tr_chairman' },
      { code: AssignmentCode.MM_Prayer, nameKey: 'tr_prayer' },
      {
        code: AssignmentCode.MM_AuxiliaryCounselor,
        nameKey: 'tr_auxClassCounselor',
      },
    ],
  },
  {
    id: 'treasuresPart',
    headerKey: 'tr_treasuresPart',
    items: [
      { code: AssignmentCode.MM_TGWTalk, nameKey: 'tr_tgwTalk' },
      { code: AssignmentCode.MM_TGWGems, nameKey: 'tr_tgwGems' },
      { code: AssignmentCode.MM_BibleReading, nameKey: 'tr_bibleReading' },
    ],
  },
  {
    id: 'applyFieldMinistryPart',
    headerKey: 'tr_applyFieldMinistryPart',
    items: [
      { code: AssignmentCode.MM_Discussion, nameKey: 'tr_discussion' },
      {
        code: AssignmentCode.MM_StartingConversation,
        nameKey: 'tr_startingConversation',
      },
      { code: AssignmentCode.MM_FollowingUp, nameKey: 'tr_followingUp' },
      {
        code: AssignmentCode.MM_MakingDisciples,
        nameKey: 'tr_makingDisciples',
      },
      {
        code: AssignmentCode.MM_ExplainingBeliefs,
        nameKey: 'tr_explainingBeliefs',
      },
      { code: AssignmentCode.MM_Talk, nameKey: 'tr_talk' },
      {
        code: AssignmentCode.MM_AssistantOnly,
        nameKey: 'tr_assistantOnly',
        borderTop: true,
      },
    ],
  },
  {
    id: 'livingPart',
    headerKey: 'tr_livingPart',
    items: [
      { code: AssignmentCode.MM_LCPart, nameKey: 'tr_lcPart' },
      {
        code: AssignmentCode.MM_CBSConductor,
        nameKey: 'tr_congregationBibleStudyConductor',
      },
      {
        code: AssignmentCode.MM_CBSReader,
        nameKey: 'tr_congregationBibleStudyReader',
      },
    ],
  },
  {
    id: 'weekendMeeting',
    headerKey: 'tr_weekendMeeting',
    items: [
      { code: AssignmentCode.WM_Chairman, nameKey: 'tr_chairman' },
      { code: AssignmentCode.WM_Prayer, nameKey: 'tr_prayer' },
      { code: AssignmentCode.WM_Speaker, nameKey: 'tr_speaker' },
      {
        code: AssignmentCode.WM_SpeakerSymposium,
        nameKey: 'tr_speakerSymposium',
      },
      {
        code: AssignmentCode.WM_WTStudyConductor,
        nameKey: 'tr_watchtowerStudyConductor',
      },
      {
        code: AssignmentCode.WM_WTStudyReader,
        nameKey: 'tr_watchtowerStudyReader',
      },
    ],
  },
  {
    id: 'ministry',
    headerKey: 'tr_ministry',
    items: [
      {
        code: AssignmentCode.MINISTRY_HOURS_CREDIT,
        nameKey: 'tr_reportHoursCredit',
      },
    ],
  },
];
