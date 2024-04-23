import { AssignmentCode } from '@definition/schedules';

const useAssignmentGroup = (isMale: boolean) => {
  const checkGroupDisabled = (id: string) => {
    let isDisabled = true;

    if (isMale) isDisabled = false;

    if (!isMale) {
      if (id === 'applyFieldMinistryPart') isDisabled = false;
    }

    return isDisabled;
  };

  const checkAssignmentDisabled = (code: AssignmentCode) => {
    let isDisabled = true;

    if (isMale) isDisabled = false;

    if (!isMale) {
      if (code === AssignmentCode.MM_StartingConversation) isDisabled = false;
      if (code === AssignmentCode.MM_FollowingUp) isDisabled = false;
      if (code === AssignmentCode.MM_MakingDisciples) isDisabled = false;
      if (code === AssignmentCode.MM_ExplainingBeliefs) isDisabled = false;
      if (code === AssignmentCode.MM_AssistantOnly) isDisabled = false;
    }

    return isDisabled;
  };

  return { checkAssignmentDisabled, checkGroupDisabled };
};

export default useAssignmentGroup;
