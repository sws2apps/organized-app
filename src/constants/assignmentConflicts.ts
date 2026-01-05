// constants/assignmentConflicts.ts
import { AssignmentCode } from '@definition/assignment';

/**
 * Gruppe: Schüleraufgaben
 * Regel: Eine Person darf maximal EINE Aufgabe aus dieser Liste pro Woche haben.
 */
export const STUDENT_TASK_CODES = [
  AssignmentCode.MM_BibleReading,
  AssignmentCode.MM_Talk,
  AssignmentCode.MM_Discussion,
  AssignmentCode.MM_StartingConversation, // Falls vorhanden
  AssignmentCode.MM_FollowingUp, // Falls vorhanden
  AssignmentCode.MM_MakingDisciples, // Falls vorhanden
  AssignmentCode.MM_ExplainingBeliefs, // Falls vorhanden
  AssignmentCode.MM_AssistantOnly,
];

/**
 * Konflikt-Matrix für "Harte Konflikte" zwischen verschiedenen Rollen.
 * (Schüler-vs-Schüler Konflikte werden jetzt über STUDENT_TASK_CODES geregelt
 * und müssen hier nicht mehr einzeln aufgeführt werden).
 */
export const ASSIGNMENT_CONFLICTS: Record<number, number[]> = {
  // --- VORSITZENDER ---
  [AssignmentCode.MM_Chairman]: [
    AssignmentCode.MM_Prayer,
    AssignmentCode.MM_AuxiliaryCounselor,
    AssignmentCode.MM_TGWTalk,
    AssignmentCode.MM_TGWGems,
    AssignmentCode.MM_LCPart,
    AssignmentCode.MM_CBSConductor,
    AssignmentCode.MM_CBSReader,
    // Plus ALLES aus der Schülergruppe (spread operator ist hier praktisch!)
    ...STUDENT_TASK_CODES,
  ],

  // --- GEBET ---
  [AssignmentCode.MM_Prayer]: [
    AssignmentCode.MM_Chairman,
    AssignmentCode.MM_TGWTalk,
    AssignmentCode.MM_AuxiliaryCounselor,
  ],

  // --- RATGEBER NEBENRAUM ---
  [AssignmentCode.MM_AuxiliaryCounselor]: [
    AssignmentCode.MM_Chairman,
    AssignmentCode.MM_TGWTalk,
    AssignmentCode.MM_TGWGems,
    AssignmentCode.MM_LCPart,
    AssignmentCode.MM_CBSConductor,
    AssignmentCode.MM_CBSReader,
    ...STUDENT_TASK_CODES, // Ein Ratgeber ist nicht gleichzeitig Schüler
  ],

  // --- SCHÄTZE VORTRAG ---
  [AssignmentCode.MM_TGWTalk]: [
    AssignmentCode.MM_Chairman,
    AssignmentCode.MM_Prayer,
    AssignmentCode.MM_TGWGems,
    AssignmentCode.MM_CBSConductor,
    AssignmentCode.MM_AuxiliaryCounselor,
    // Meist macht man als Ältester keinen Schätze-Vortrag UND eine Schüleraufgabe
    ...STUDENT_TASK_CODES,
  ],

  // --- PERLEN ---
  [AssignmentCode.MM_TGWGems]: [
    AssignmentCode.MM_Chairman,
    AssignmentCode.MM_TGWTalk,
    AssignmentCode.MM_AuxiliaryCounselor,
  ],
  // --- ASSISTANT ONLY ONCE A MEETING ---
  [AssignmentCode.MM_AssistantOnly]: [AssignmentCode.MM_AssistantOnly],

  // --- CBS ---
  [AssignmentCode.MM_CBSConductor]: [
    AssignmentCode.MM_Chairman,
    AssignmentCode.MM_TGWTalk,
    AssignmentCode.MM_LCPart,
    AssignmentCode.MM_CBSReader,
    AssignmentCode.MM_AuxiliaryCounselor,
  ],
};
