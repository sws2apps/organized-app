import { useAtomValue } from 'jotai';
import { AssignmentCode } from '@definition/assignment';
import { useAppTranslation } from '@hooks/index';
import {
  personIsFR,
  personIsFS,
  personIsPublisher,
} from '@services/app/persons';
import { personCurrentDetailsState } from '@states/persons';
import { userDataViewState } from '@states/settings';

const useAssignmentGroup = (male: boolean) => {
  const { t } = useAppTranslation();

  const person = useAtomValue(personCurrentDetailsState);
  const dataView = useAtomValue(userDataViewState);

  const checkGroupDisabled = (id: string) => {
    let isDisabled = true;

    if (id === 'ministry') {
      const isFR = personIsFR(person);
      const isFS = personIsFS(person);

      const isPioneer = isFR || isFS;

      if (isPioneer) return false;

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

    const assignments =
      person.person_data.assignments.find((a) => a.type === dataView)?.values ??
      [];

    if (code === AssignmentCode.MINISTRY_HOURS_CREDIT) {
      const isFR = personIsFR(person);
      const isFS = personIsFS(person);

      const isPioneer = isFR || isFS;

      return !isPioneer;
    }

    if (code === AssignmentCode.MM_AssistantOnly) {
      if (
        assignments.some(
          (record) =>
            (record >= AssignmentCode.MM_StartingConversation &&
              record <= AssignmentCode.MM_Discussion) ||
            record == AssignmentCode.MM_Talk
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
        assignments.some((record) => record === AssignmentCode.MM_AssistantOnly)
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
