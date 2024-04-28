import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppTranslation } from '@hooks/index';
import { apiGetApprovedVisitingSpeakersAccess } from '@services/api/visitingSpeakers';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';

const useCongregationsAccess = (closeDialog: VoidFunction) => {
  const { t } = useAppTranslation();

  const { isPending, data, error } = useQuery({
    queryKey: ['visiting_speakers_access_list'],
    queryFn: apiGetApprovedVisitingSpeakersAccess,
    refetchOnMount: 'always',
  });

  const congregations = data?.result?.congregations || [];

  useEffect(() => {
    const handleQueryResponse = async () => {
      if (!isPending && error) {
        closeDialog();

        await displaySnackNotification({
          header: t('tr_errorTitle'),
          message: getMessageByCode(error.message),
          severity: 'error',
        });
      }

      if (!isPending && data && data.status !== 200) {
        closeDialog();
        await displaySnackNotification({
          header: t('tr_errorTitle'),
          message: getMessageByCode(data.result.message),
          severity: 'error',
        });
      }
    };

    handleQueryResponse();
  }, [isPending, error, data, closeDialog, t]);

  return { congregations, isPending };
};

export default useCongregationsAccess;
