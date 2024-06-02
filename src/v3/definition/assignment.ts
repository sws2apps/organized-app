export enum AssignmentCode {
  MM_BibleReading = 100,
  MM_InitialCall = 101,
  MM_ReturnVisit = 102,
  MM_BibleStudy = 103,
  MM_Talk = 104,
  MM_InitialCallVideo = 105,
  MM_ReturnVisitVideo = 106,
  MM_Other = 107,
  MM_Memorial = 108,
  MM_Chairman = 110,
  MM_Prayer = 111,
  MM_TGWTalk = 112,
  MM_TGWGems = 113,
  MM_LCPart = 114,
  MM_CBSConductor = 115,
  MM_CBSReader = 116,
  MM_MemorialVideo = 117,
  WM_Chairman = 118,
  WM_Prayer = 119,
  WM_Speaker = 120,
  WM_SpeakerSymposium = 121,
  WM_WTStudyReader = 122,
  MM_StartingConversation = 123,
  MM_FollowingUp = 124,
  MM_MakingDisciples = 125,
  MM_ExplainingBeliefs = 126,
  MM_Discussion = 127,
  MM_AuxiliaryCounselor = 128,
  MM_AssistantOnly = 129,
  WM_WTStudyConductor = 130,
}

export type AssignmentType = {
  /**
   * The code of the assignment.
   */
  code: AssignmentCode;

  /**
   * Indicates whether the assignment is assignable.
   */
  assignable: boolean;

  /**
   * Indicates whether the assignment is only for male.
   */
  maleOnly: boolean;

  /**
   * Link an assignment to an existing one.
   */
  linkTo?: AssignmentCode;

  /**
   * The type of the assignment. It can be 'tgw', 'ayf', or 'lc'.
   */
  type?: 'mm' | 'tgw' | 'ayf' | 'lc';

  /**
   * The name of the assignment type in different languages.
   */
  assignment_type_name: { [language: string]: string };
};

export type AssignmentLocalType = {
  value: number;
  label: string;
  assignable: boolean;
  maleOnly: boolean;
  type: string;
  linkTo: number;
};

export type AssignmentAYFOnlyType = {
  value: number;
  label: string;
};
