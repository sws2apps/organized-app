import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { CongregationResponseType } from '@definition/api';
import { CountryType } from '@components/country_selector/index.types';
import { firstnameState, lastnameState } from '@states/settings';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { apiUserJoinCongregation } from '@services/api/user';

const useRequestAccess = () => {
  const { t } = useAppTranslation();

  const firstnameInitial = useRecoilValue(firstnameState);
  const lastnameInitial = useRecoilValue(lastnameState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [firstname, setFirstname] = useState(firstnameInitial);
  const [lastname, setLastname] = useState(lastnameInitial);
  const [country, setCountry] = useState<CountryType>(null);
  const [congregation, setCongregation] =
    useState<CongregationResponseType>(null);

  const handleRequestAccess = async () => {
    if (requestSent || isProcessing) return;

    try {
      setIsProcessing(true);

      await apiUserJoinCongregation({
        cong_number: congregation.congNumber,
        country_code: country.code,
        firstname,
        lastname,
      });

      setIsProcessing(false);
      setRequestSent(true);

      await displaySnackNotification({
        header: t('tr_requestAccessSent'),
        message: t('tr_requestAccessSentDesc'),
        severity: 'success',
      });
    } catch (error) {
      setIsProcessing(false);

      console.error(error);

      await displaySnackNotification({
        header: t('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return {
    firstname,
    setFirstname,
    lastname,
    setLastname,
    setCountry,
    country,
    congregation,
    setCongregation,
    isProcessing,
    handleRequestAccess,
  };
};

export default useRequestAccess;
