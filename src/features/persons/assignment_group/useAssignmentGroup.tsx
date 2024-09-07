import { AssignmentCode } from '@definition/assignment';
import { personIsFR, personIsPublisher } from '@services/app/persons';
import { personCurrentDetailsState } from '@states/persons';
import { useRecoilValue } from 'recoil';

const useAssignmentGroup = (male: boolean) => {
  const person = useRecoilValue(personCurrentDetailsState);

  const checkGroupDisabled = (id: string) => {
    let isDisabled = true;

    if (id === 'ministry') {
      const isPublisher = personIsPublisher(person);
      return !isPublisher;
    }

    if (male) isDisabled = false;

    if (!male) {
      if (id === 'applyFieldMinistryPart') isDisabled = false;
    }

    return isDisabled;
  };

  const checkAssignmentDisabled = (code: AssignmentCode) => {
    let isDisabled = true;

    if (code === AssignmentCode.MINISTRY_HOURS_CREDIT) {
      const isFR = personIsFR(person);
      return !isFR;
    }

    if (male) isDisabled = false;

    if (!male) {
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
