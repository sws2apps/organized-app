import { useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  PreachingPartnerFilterType,
  PreachingPartnerRequestType,
} from '@definition/preaching_partner';
import {
  congregationPreachingPartnerGroupsState,
  preachingPartnerFiltersState,
} from '@states/preaching_partner';
import { useAppTranslation } from '@hooks/index';

const useCongregationRequests = () => {
  const { t } = useAppTranslation();

  const groups = useAtomValue(congregationPreachingPartnerGroupsState);

  const [filters, setFilters] = useAtom(preachingPartnerFiltersState);

  const [joinRequest, setJoinRequest] = useState<PreachingPartnerRequestType>();

  const filterOptions: { key: PreachingPartnerFilterType; label: string }[] = [
    { key: 'all', label: t('tr_all') },
    { key: 'door-to-door', label: t('tr_doorToDoor') },
    { key: 'bible-study', label: t('tr_bibleStudy') },
    { key: 'public-witnessing', label: t('tr_PW') },
    { key: 'male', label: t('tr_male') },
    { key: 'female', label: t('tr_female') },
  ];

  const handleToggleFilter = (key: PreachingPartnerFilterType) => {
    if (key === 'all') {
      setFilters(['all']);
      return;
    }

    setFilters((prev) => {
      const next = prev.includes(key)
        ? prev.filter((record) => record !== key)
        : [...prev.filter((record) => record !== 'all'), key];

      return next.length === 0 ? ['all'] : next;
    });
  };

  const handleJoin = (request: PreachingPartnerRequestType) => {
    setJoinRequest(request);
  };

  const handleCloseJoin = () => setJoinRequest(undefined);

  return {
    groups,
    filters,
    filterOptions,
    joinRequest,
    handleToggleFilter,
    handleJoin,
    handleCloseJoin,
  };
};

export default useCongregationRequests;
