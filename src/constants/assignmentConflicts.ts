// constants/assignmentConflicts.ts
import { AssignmentCode } from '@definition/assignment';

export const STUDENT_TASK_CODES = [
  AssignmentCode.MM_BibleReading,
  AssignmentCode.MM_Talk,
  AssignmentCode.MM_Discussion,
  AssignmentCode.MM_StartingConversation,
  AssignmentCode.MM_FollowingUp,
  AssignmentCode.MM_MakingDisciples,
  AssignmentCode.MM_ExplainingBeliefs,
  AssignmentCode.MM_AssistantOnly,
  AssignmentCode.MM_InitialCall,
  AssignmentCode.MM_ReturnVisit,
  AssignmentCode.MM_BibleStudy,
  AssignmentCode.MM_Memorial,
];

export const ASSIGNMENT_CONFLICTS: Record<number, number[]> = {
  // ─────────────────────────────────────────────
  // MIDWEEK MEETING (MM)
  // ─────────────────────────────────────────────
  [AssignmentCode.MM_Chairman]: [
    AssignmentCode.MM_AuxiliaryCounselor,
    AssignmentCode.MM_TGWTalk,
    AssignmentCode.MM_LCPart,
    AssignmentCode.MM_CBSConductor,
    ...STUDENT_TASK_CODES,
  ],

  [AssignmentCode.MM_AuxiliaryCounselor]: [
    AssignmentCode.MM_Chairman,
    ...STUDENT_TASK_CODES,
  ],

  [AssignmentCode.MM_TGWTalk]: [AssignmentCode.MM_Chairman],

  [AssignmentCode.MM_TGWGems]: [AssignmentCode.MM_Chairman],

  [AssignmentCode.MM_AssistantOnly]: [AssignmentCode.MM_AssistantOnly],

  [AssignmentCode.MM_CBSConductor]: [
    AssignmentCode.MM_Chairman,
    AssignmentCode.MM_CBSReader,
  ],

  // ─────────────────────────────────────────────
  // WEEKEND MEETING (WM)
  // ─────────────────────────────────────────────
  [AssignmentCode.WM_Chairman]: [
    AssignmentCode.WM_Speaker,
    AssignmentCode.WM_SpeakerSymposium,
    AssignmentCode.WM_WTStudyConductor,
  ],

  [AssignmentCode.WM_WTStudyConductor]: [
    AssignmentCode.WM_Chairman,
    AssignmentCode.WM_Speaker,
    AssignmentCode.WM_SpeakerSymposium,
    AssignmentCode.WM_WTStudyReader,
  ],

  [AssignmentCode.WM_Speaker]: [
    AssignmentCode.WM_Chairman,
    AssignmentCode.WM_SpeakerSymposium,
    AssignmentCode.WM_WTStudyConductor,
    AssignmentCode.WM_WTStudyReader,
  ],

  [AssignmentCode.WM_SpeakerSymposium]: [
    AssignmentCode.WM_Chairman,
    AssignmentCode.WM_Speaker,
    AssignmentCode.WM_WTStudyConductor,
    AssignmentCode.WM_WTStudyReader,
  ],

  [AssignmentCode.WM_WTStudyReader]: [
    AssignmentCode.WM_Chairman,
    AssignmentCode.WM_WTStudyConductor,
    AssignmentCode.WM_Speaker,
    AssignmentCode.WM_SpeakerSymposium,
  ],
};

// Internal workload preferences, not rules for whether someone is qualified.
export const ASSIGNMENT_WORKLOAD = {
  wholeMeeting: 100,
  unknownPart: 20,
  overlap: 1000,
};

export const PART_DURATION_FALLBACKS: Record<string, number> = {
  opening_prayer: 1,
  closing_prayer: 1,
  tgw_bible_reading: 4,
  tgw_talk: 10,
  tgw_gems: 10,
  lc_cbs: 30,
  public_talk: 30,
  w_study: 60,
  chairman: ASSIGNMENT_WORKLOAD.wholeMeeting,
  aux_counselor: ASSIGNMENT_WORKLOAD.wholeMeeting,
};

// These roles need continuous coverage; no unrecorded substitute is assumed.
export const CONTINUOUS_DUTIES: (AssignmentCode | undefined)[] = [
  AssignmentCode.DUTIES_Audio,
  AssignmentCode.DUTIES_Video,
  AssignmentCode.DUTIES_AudioVideo,
  AssignmentCode.DUTIES_Stage,
  AssignmentCode.DUTIES_EntranceAttendant,
  AssignmentCode.DUTIES_AuditoriumAttendant,
  AssignmentCode.DUTIES_VideoconferenceHost,
];
