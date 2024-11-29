import { AssignmentCode } from '@definition/assignment';
import { useAppTranslation } from '@hooks/index';
import { personIsFR, personIsPublisher } from '@services/app/persons';
import { personCurrentDetailsState } from '@states/persons';
import { useRecoilValue } from 'recoil';

const useAssignmentGroup = (male: boolean) => {
  const person = useRecoilValue(personCurrentDetailsState);
  const { t } = useAppTranslation();

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

  const isMinistryDisabled = (
    id: string,
    items: { code: AssignmentCode }[]
  ) => {
    if (!items.length) return false;
    return id === 'ministry' && checkAssignmentDisabled(items[0].code);
  };

  const isDisabledByGender = (id: string) => {
    return !male && id !== 'applyFieldMinistryPart';
  };

  const getTooltipsForAssignmentTitles = (
    id: string,
    items: { code: AssignmentCode }[]
  ) => {
    if (isMinistryDisabled(id, items)) {
      return t('tr_onlyAvailableForPioneers');
    }
    if (isDisabledByGender(id)) {
      return t('tr_appliesOnlyToBrothers');
    }
    return '';
  };

  return {
    checkAssignmentDisabled,
    checkGroupDisabled,
    isMinistryDisabled,
    isDisabledByGender,
    getTooltipsForAssignmentTitles,
  };
};

export default useAssignmentGroup;
