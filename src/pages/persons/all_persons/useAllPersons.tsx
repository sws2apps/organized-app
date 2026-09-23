import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';
import { personCurrentDetailsState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/states/persons';
import { apiCongregationUsersGet } from '@services/api/congregation';
import { congAccountConnectedState } from '@states/app';
import { congregationUsersState } from '@states/congregation';
import useCurrentUser from '@hooks/useCurrentUser';
import useBreakpoints from '@hooks/useBreakpoints';
import useSubpane from '@hooks/useSubpane';

const useAllPersons = () => {
  const [isDataExchangeOpen, setIsDataExchangeOpen] = useState(false);

  const handleOpenExchange = () => setIsDataExchangeOpen(true);

  const handleCloseExchange = () => setIsDataExchangeOpen(false);

  const navigate = useNavigate();

  const { isAdmin } = useCurrentUser();

  const { desktopUp } = useBreakpoints();

  // in the URL, so the device back gesture closes the filters on small screens
  const filtersPane = useSubpane('filters');
  const isPanelOpen = filtersPane.open;

  const setIsPanelOpen = useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      const value = typeof next === 'function' ? next(filtersPane.open) : next;
      filtersPane.setOpen(value, !desktopUp);
    },
    [filtersPane, desktopUp]
  );

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
    isDataExchangeOpen,
    handleOpenExchange,
    handleCloseExchange,
  };
};

export default useAllPersons;
