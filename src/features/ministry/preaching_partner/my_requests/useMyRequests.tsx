import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSetAtom, useAtomValue } from 'jotai';
import { PreachingPartnerRequestType } from '@definition/preaching_partner';
import {
  partnerMutationState,
  myPreachingPartnerGroupsState,
} from '@states/preaching_partner';
import { displaySnackNotification } from '@services/states/app';
import { getTranslation } from '@services/i18n/translation';

const useMyRequests = () => {
  const mutate = useSetAtom(partnerMutationState);
  const [calendarRequest, setCalendarRequest] =
    useState<PreachingPartnerRequestType>();
  const groups = useAtomValue(myPreachingPartnerGroupsState);

  const navigate = useNavigate();

  const [editRequest, setEditRequest] = useState<PreachingPartnerRequestType>();
  const [cancelRequest, setCancelRequest] =
    useState<PreachingPartnerRequestType>();

  const handleEdit = (request: PreachingPartnerRequestType) =>
    setEditRequest(request);

  const handleCloseEditor = () => setEditRequest(undefined);

  const handleCancel = (request: PreachingPartnerRequestType) =>
    setCancelRequest(request);

  const handleCloseCancel = () => setCancelRequest(undefined);

  const handleConfirmCancel = async () => {
    if (!cancelRequest) return;

    await mutate({ action: 'cancel', request: cancelRequest });

    setCancelRequest(undefined);

    displaySnackNotification({
      header: getTranslation({ key: 'tr_arrangementCancelled' }),
      message: getTranslation({ key: 'tr_arrangementCancelledDesc' }),
      severity: 'success',
    });
  };

  // swaps the tab in place, as picking it from the menu would
  const handleSeeCongregation = () =>
    navigate('/find-a-preaching-partner/congregation-requests', {
      replace: true,
    });

  return {
    calendarRequest,
    handleCalendar: setCalendarRequest,
    handleCloseCalendar: () => setCalendarRequest(undefined),
    groups,
    editRequest,
    cancelRequest,
    handleEdit,
    handleCloseEditor,
    handleCancel,
    handleCloseCancel,
    handleConfirmCancel,
    handleSeeCongregation,
  };
};

export default useMyRequests;
