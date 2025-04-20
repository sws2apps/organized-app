import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  personCurrentDetailsState,
  personsFilterOpenState,
} from '@states/persons';
import { setPersonCurrentDetails } from '@services/states/persons';
import { apiCongregationUsersGet } from '@services/api/congregation';
import { congAccountConnectedState, congregationUsersState } from '@states/app';
import useCurrentUser from '@hooks/useCurrentUser';

const useAllPersons = () => {
  const navigate = useNavigate();

  const { isAdmin } = useCurrentUser();

  const [isPanelOpen, setIsPanelOpen] = useAtom(personsFilterOpenState);

  const setUsers = useSetAtom(congregationUsersState);

  const person = useAtomValue(personCurrentDetailsState);
  const isConnected = useAtomValue(congAccountConnectedState);

  const { data } = useQuery({
    queryKey: ['congregation_users'],
    queryFn: apiCongregationUsersGet,
    refetchOnMount: 'always',
    enabled: isConnected && isAdmin,
  });

  const handlePersonAdd = async () => {
    const newPerson = structuredClone(person);
    newPerson.person_uid = crypto.randomUUID();

    setPersonCurrentDetails(newPerson);

    navigate('/persons/new');
  };

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setUsers(data);
    }
  }, [setUsers, data]);

  return {
    handlePersonAdd,
    isPanelOpen,
    setIsPanelOpen,
  };
};

export default useAllPersons;
