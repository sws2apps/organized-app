import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { apiFetchCongregations } from '@services/api/congregation';
import { displaySnackNotification } from '@services/states/app';
import { useAppTranslation } from '@hooks/index';
import { CongregationResponseType } from '@definition/api';
import { speakersCongregationsActiveState } from '@states/speakers_congregations';
import { getMessageByCode } from '@services/i18n/translation';

const useCongregation = (
  country_code: string,
  cong_number?: string,
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
            country_code,
            name
          );

          if (status !== 200) {
            displaySnackNotification({
              header: getMessageByCode('error_app_generic-title'),
              message: t('tr_congregationsFetchError'),
              severity: 'error',
            });
          }

          if (active && status === 200) {
            if (Array.isArray(data)) {
              const optionsRemoveRemote = data.filter((record) =>
                congregations.find(
                  (cong) =>
                    cong.cong_data.cong_number.value === record.congNumber
                )
                  ? false
                  : true
              );

              const finalOptions = optionsRemoveRemote.filter(
                (record) => record.congNumber !== cong_number
              );

              setOptions(finalOptions);
            }
          }

          setIsLoading(false);
        } catch (err) {
          setIsLoading(false);
          throw new Error(err);
        }
      };

      const testValue = value ? `(${value.congNumber}) ${value.congName}` : '';
      if (inputValue !== testValue) {
        fetchTimer = setTimeout(() => {
          fetchCongregations(inputValue);
        }, 250);
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }

    return () => {
      active = false;
      if (fetchTimer) clearTimeout(fetchTimer);
    };
  }, [country_code, value, inputValue, t, cong_number, congregations]);

  return { setValue, value, setInputValue, options, isLoading, inputValue };
};

export default useCongregation;
