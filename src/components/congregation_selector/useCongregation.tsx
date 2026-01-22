import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { apiFetchCongregations } from '@services/api/congregation';
import { displaySnackNotification } from '@services/states/app';
import { useAppTranslation } from '@hooks/index';
import { CongregationResponseType } from '@definition/api';
import { speakersCongregationsActiveState } from '@states/speakers_congregations';
import { getMessageByCode } from '@services/i18n/translation';
import Sentry from '@services/sentry';

const useCongregation = (
  country_guid: string,
  cong_name?: string,
  freeSoloValue?: string
) => {
  const { t } = useAppTranslation();

  const congregations = useAtomValue(speakersCongregationsActiveState);

  const [value, setValue] = useState<CongregationResponseType>(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<CongregationResponseType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setInputValue(freeSoloValue || '');
  }, [freeSoloValue]);

  useEffect(() => {
    let active = true;
    let fetchTimer;

    try {
      if (inputValue.length < 2) {
        setOptions(value ? [value] : []);
        return undefined;
      }

      const fetchCongregations = async (name) => {
        try {
          setIsLoading(true);

          const { data, status } = await apiFetchCongregations(
            country_guid,
            name
          );

          if (status !== 200) {
            displaySnackNotification({
              header: getMessageByCode('error_app_generic-title'),
              message: getMessageByCode('error_app_congregation-search-error'),
              severity: 'error',
            });
          }

          if (!active || status !== 200) {
            setIsLoading(false);
            return;
          }

          if (!Array.isArray(data)) {
            setIsLoading(false);
            return;
          }

          const optionsRemoveRemote = data.filter(
            (record) =>
              !congregations.some(
                (cong) => cong.cong_data.cong_name.value === record.congName
              )
          );

          const finalOptions = optionsRemoveRemote.filter(
            (record) => record.congName !== cong_name
          );

          setOptions(finalOptions);

          setIsLoading(false);
        } catch (err) {
          setIsLoading(false);
          throw new Error(err);
        }
      };

      const testValue = value ? value.congName : '';

      if (inputValue !== testValue) {
        fetchTimer = setTimeout(() => {
          fetchCongregations(inputValue);
        }, 250);
      }
    } catch (err) {
      console.error(err);
      Sentry.captureException(err);
      setIsLoading(false);
    }

    return () => {
      active = false;
      if (fetchTimer) clearTimeout(fetchTimer);
    };
  }, [country_guid, value, inputValue, t, cong_name, congregations]);

  return { setValue, value, setInputValue, options, isLoading, inputValue };
};

export default useCongregation;
