import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { PreachingPartnerRequestType } from '@definition/preaching_partner';
import { myPreachingPartnerGroupsState } from '@states/preaching_partner';

const useMyRequests = () => {
  const groups = useAtomValue(myPreachingPartnerGroupsState);

  const [editRequest, setEditRequest] = useState<PreachingPartnerRequestType>();

  const handleEdit = (request: PreachingPartnerRequestType) => {
    setEditRequest(request);
  };

  const handleCloseEditor = () => setEditRequest(undefined);

  return { groups, editRequest, handleEdit, handleCloseEditor };
};

export default useMyRequests;
