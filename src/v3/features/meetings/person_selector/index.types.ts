import { AssignmentCode } from '@definition/assignment';
import { PersonType } from '@definition/person';

export type PersonSelectorType = {
  label: string;
  week: string;
  type: AssignmentCode;
  assignment:
    | 'MM_Chairman_A'
    | 'MM_Chairman_B'
    | 'MM_OpeningPrayer'
    | 'MM_TGWTalk'
    | 'MM_TGWGems'
    | 'MM_TGWBibleReading_A'
    | 'MM_TGWBibleReading_B'
    | 'MM_AYFPart1_Student_A'
    | 'MM_AYFPart1_Assistant_A'
    | 'MM_AYFPart1_Student_B'
    | 'MM_AYFPart1_Assistant_B'
    | 'MM_AYFPart2_Student_A'
    | 'MM_AYFPart2_Assistant_A'
    | 'MM_AYFPart2_Student_B'
    | 'MM_AYFPart2_Assistant_B'
    | 'MM_AYFPart3_Student_A'
    | 'MM_AYFPart3_Assistant_A'
    | 'MM_AYFPart3_Student_B'
    | 'MM_AYFPart3_Assistant_B'
    | 'MM_AYFPart4_Student_A'
    | 'MM_AYFPart4_Assistant_A'
    | 'MM_AYFPart4_Student_B'
    | 'MM_AYFPart4_Assistant_B'
    | 'MM_LCPart1'
    | 'MM_LCPart2'
    | 'MM_LCPart3'
    | 'MM_LCCBSConductor'
    | 'MM_LCCBSReader'
    | 'MM_ClosingPrayer';
};

export type GenderType = 'male' | 'female';

export type PersonOptionsType = PersonType & {
  last_assignment?: string;
  last_assistant?: string;
  hall?: string;
};
