import { AssignmentCode } from '@definition/assignment';
import { useAppTranslation } from '@hooks/index';
import { personIsFR, personIsPublisher } from '@services/app/persons';
import { personCurrentDetailsState } from '@states/persons';
import { useRecoilValue } from 'recoil';

const useAssignmentGroup = (male: boolean) => {
  const { t } = useAppTranslation();

  const person = useRecoilValue(personCurrentDetailsState);

  const checkGroupDisabled = (id: string) => {
    let isDisabled = true;

    if (id === 'ministry') {
      const isFR = personIsFR(person);
      if (isFR) return false;

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

    const assignments = person.person_data.assignments.filter(
      (record) => !record._deleted
    );

    if (code === AssignmentCode.MINISTRY_HOURS_CREDIT) {
      const isFR = personIsFR(person);
      return !isFR;
    }

    if (code === AssignmentCode.MM_AssistantOnly) {
      if (
        assignments.some(
          (record) =>
            (record.code >= AssignmentCode.MM_StartingConversation &&
              record.code <= AssignmentCode.MM_Discussion) ||
            record.code == AssignmentCode.MM_Talk
        )
      ) {
        return true;
      }
    }

    if (
      (code >= AssignmentCode.MM_StartingConversation &&
        code <= AssignmentCode.MM_Discussion) ||
      code === AssignmentCode.MM_Talk
    ) {
      if (
        assignments.some(
          (record) => record.code === AssignmentCode.MM_AssistantOnly
        )
      ) {
        return true;
      }
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
    return !male && id !== 'applyFieldMinistryPart' && id !== 'ministry';
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
