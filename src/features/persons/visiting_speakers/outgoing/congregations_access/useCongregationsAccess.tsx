import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppTranslation } from '@hooks/index';
import {
  apiGetApprovedVisitingSpeakersAccess,
  apiRejectRequestCongregationSpeakers,
} from '@services/api/visitingSpeakers';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { CongregationRequestType } from '@definition/api';

const useCongregationsAccess = (closeDialog: VoidFunction) => {
  const { t } = useAppTranslation();

  const { isPending, data, error, refetch } = useQuery({
    queryKey: ['visiting_speakers_access_list'],
    queryFn: apiGetApprovedVisitingSpeakersAccess,
    refetchOnMount: 'always',
  });

  const [congregations, setCongregations] = useState<CongregationRequestType[]>(
    []
  );
  const [congregationRevoke, setCongregationRevoke] =
    useState<CongregationRequestType | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  const handleSetDelete = (cong: CongregationRequestType) => {
    setCongregationRevoke(cong);
  };

  const handleRevokeAccess = async () => {
    try {
      if (!isRevoking) {
        setIsRevoking(true);

        const { request_id } = congregationRevoke;

        const { status } =
          await apiRejectRequestCongregationSpeakers(request_id);

        if (status === 200) {
          const { data } = await refetch();

          if (data?.result?.congregations) {
            setCongregations(data.result.congregations);
          }

          setCongregationRevoke(null);
        }
      }
    } catch (err) {
      setCongregationRevoke(null);
      setIsRevoking(false);

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(err.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    if (!isPending) {
      if (error || (data && data.status !== 200)) {
        closeDialog();

        const message = error ? error.message : data.result.message;

        displaySnackNotification({
          header: t('tr_errorTitle'),
          message: getMessageByCode(message),
          severity: 'error',
        });
      }

      if (data?.result?.congregations) {
        setCongregations(data.result.congregations);
      }
    }
  }, [isPending, error, data, closeDialog, t]);

  return {
    congregations,
    isPending,
    congregationRevoke,
    handleSetDelete,
    handleRevokeAccess,
  };
};

export default useCongregationsAccess;
