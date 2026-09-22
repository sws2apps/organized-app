import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { PreachingPartnerRequestType } from '@definition/preaching_partner';
import {
  myPreachingPartnerGroupsState,
  preachingPartnerTabState,
} from '@states/preaching_partner';
import { dbPreachingPartnerArrangementClear } from '@services/dexie/preaching_partner';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode, getTranslation } from '@services/i18n/translation';

const useMyRequests = () => {
  const groups = useAtomValue(myPreachingPartnerGroupsState);

  const setTab = useSetAtom(preachingPartnerTabState);

  const [editRequest, setEditRequest] = useState<PreachingPartnerRequestType>();
  const [cancelRequest, setCancelRequest] =
    useState<PreachingPartnerRequestType>();
  const [isCancelling, setIsCancelling] = useState(false);

  const handleEdit = (request: PreachingPartnerRequestType) =>
    setEditRequest(request);

  const handleCloseEditor = () => setEditRequest(undefined);

  const handleCancel = (request: PreachingPartnerRequestType) =>
    setCancelRequest(request);

  const handleCloseCancel = () => setCancelRequest(undefined);

  const handleConfirmCancel = async () => {
    if (isCancelling || !cancelRequest) return;

    try {
      setIsCancelling(true);

      await dbPreachingPartnerArrangementClear(cancelRequest.request_uid);

      setIsCancelling(false);
      setCancelRequest(undefined);

      displaySnackNotification({
        header: getTranslation({ key: 'tr_arrangementCancelled' }),
        message: getTranslation({ key: 'tr_arrangementCancelledDesc' }),
        severity: 'success',
      });
    } catch (error) {
      setIsCancelling(false);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleSeeCongregation = () => setTab('congregation');

  return {
    groups,
    editRequest,
    cancelRequest,
    isCancelling,
    handleEdit,
    handleCloseEditor,
    handleCancel,
    handleCloseCancel,
    handleConfirmCancel,
    handleSeeCongregation,
  };
};

export default useMyRequests;
