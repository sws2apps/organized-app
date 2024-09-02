import { useMemo } from 'react';
import { useCurrentUser } from '@hooks/index';
import {
  personIsAP,
  personIsFMF,
  personIsFR,
  personIsFS,
} from '@services/app/persons';

const useMinistry = () => {
  const { person } = useCurrentUser();

  const isPioneer = useMemo(() => {
    const isAP = personIsAP(person);
    const isFR = personIsFR(person);
    const isFS = personIsFS(person);
    const isFMF = personIsFMF(person);

    return isAP || isFR || isFS || isFMF;
  }, [person]);

  return { isPioneer };
};

export default useMinistry;
