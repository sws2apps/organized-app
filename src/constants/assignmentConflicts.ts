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
];

export const ASSIGNMENT_CONFLICTS: Record<number, number[]> = {
  [AssignmentCode.MM_Chairman]: [
    AssignmentCode.MM_Prayer,
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

  [AssignmentCode.MM_TGWTalk]: [
    AssignmentCode.MM_Chairman,
    AssignmentCode.MM_TGWGems,
    ...STUDENT_TASK_CODES,
  ],

  [AssignmentCode.MM_TGWGems]: [AssignmentCode.MM_Chairman],
  [AssignmentCode.MM_AssistantOnly]: [AssignmentCode.MM_AssistantOnly],

  [AssignmentCode.MM_CBSConductor]: [
    AssignmentCode.MM_Chairman,
    AssignmentCode.MM_CBSReader,
  ],
};
