import { useRecoilValue } from 'recoil';
import { personsActiveState } from '@states/persons';
import usePerson from './usePerson';

const usePersons = () => {
  const {
    personIsActivePublisher,
    personIsPublisher,
    personIsInactivePublisher,
    personIsBaptizedPublisher,
    personIsUnbaptizedPublisher,
    personIsPrivilegeActive,
    personIsEnrollmentActive,
  } = usePerson();

  const persons = useRecoilValue(personsActiveState);

  const getPublishersActive = (month: string) => {
    const result = persons.filter((record) => {
      const isPublisher = personIsPublisher(record, month);
      if (!isPublisher) return false;

      const isActive = personIsActivePublisher(record, month);
      return isActive;
    });

    return result;
  };

  const getPublishersInactive = (month: string) => {
    const result = persons.filter((record) => {
      const isPublisher = personIsPublisher(record, month);
      if (!isPublisher) return false;

      const isInactive = personIsInactivePublisher(record, month);
      return isInactive;
    });

    return result;
  };

  const getPublishersBaptized = (month: string) => {
    const result = persons.filter((record) => {
      const isPublisher = personIsPublisher(record, month);
      if (!isPublisher) return false;

      const isBaptized = personIsBaptizedPublisher(record, month);
      return isBaptized;
    });

    return result;
  };

  const getPublishersUnbaptized = (month: string) => {
    const result = persons.filter((record) => {
      const isPublisher = personIsPublisher(record, month);
      if (!isPublisher) return false;

      const isUnbaptized = personIsUnbaptizedPublisher(record, month);
      return isUnbaptized;
    });

    return result;
  };

  const getAppointedBrothers = (month: string) => {
    const result = persons.filter((record) => {
      const isElder = personIsPrivilegeActive(record, 'elder', month);
      if (isElder) return true;

      const isMS = personIsPrivilegeActive(record, 'ms', month);
      return isMS;
    });

    return result;
  };

  const getAuxiliaryPioneers = (month: string) => {
    const result = persons.filter((record) => {
      const isAP = personIsEnrollmentActive(record, 'AP', month);
      return isAP;
    });

    return result;
  };

  const getRegularPioneers = (month: string) => {
    const result = persons.filter((record) => {
      const isAP = personIsEnrollmentActive(record, 'FR', month);
      return isAP;
    });

    return result;
  };

  return {
    getPublishersActive,
    getPublishersInactive,
    getPublishersBaptized,
    getPublishersUnbaptized,
    getAppointedBrothers,
    getAuxiliaryPioneers,
    getRegularPioneers,
  };
};

export default usePersons;
