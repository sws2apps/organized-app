import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  personCurrentDetailsState,
  personsFilterOpenState,
} from '@states/persons';
import { setPersonCurrentDetails } from '@services/recoil/persons';
import { apiCongregationUsersGet } from '@services/api/congregation';
import { congAccountConnectedState, congregationUsersState } from '@states/app';
import useCurrentUser from '@hooks/useCurrentUser';

const useAllPersons = () => {
  const navigate = useNavigate();

  const { isAdmin } = useCurrentUser();

  const [isPanelOpen, setIsPanelOpen] = useRecoilState(personsFilterOpenState);

  const setUsers = useSetRecoilState(congregationUsersState);

  const person = useRecoilValue(personCurrentDetailsState);
  const isConnected = useRecoilValue(congAccountConnectedState);

  const { data } = useQuery({
    queryKey: ['congregation_users'],
    queryFn: apiCongregationUsersGet,
    refetchOnMount: 'always',
    enabled: isConnected && isAdmin,
  });

  const handlePersonAdd = async () => {
    const newPerson = structuredClone(person);
    newPerson.person_uid = crypto.randomUUID();

    await setPersonCurrentDetails(newPerson);

    navigate('/persons/new');
  };

  useEffect(() => {
    if (data && Array.isArray(data?.users)) {
      setUsers(data.users);
    }
  }, [setUsers, data]);

  return {
    handlePersonAdd,
    isPanelOpen,
    setIsPanelOpen,
  };
};

export default useAllPersons;
