import { useEffect, useState } from 'react';
import { apiFetchCongregations } from '@services/api/congregation';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';
import { CongregationResponseType } from '@definition/api';

const useCongregation = (country_code: string, cong_number?: string) => {
  const { t } = useAppTranslation();

  const [value, setValue] = useState<CongregationResponseType>(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<CongregationResponseType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

          const { data, status } = await apiFetchCongregations(country_code, name);

          if (status !== 200) {
            await displaySnackNotification({
              header: t('tr_errorTitle'),
              message: t('tr_congregationsFetchError'),
              severity: 'error',
            });
          }

          if (active && status === 200) {
            if (Array.isArray(data)) {
              const filteredData = data.filter((record) => record.congNumber !== cong_number);
              setOptions(filteredData);
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
      setIsLoading(false);
    }

    return () => {
      active = false;
      if (fetchTimer) clearTimeout(fetchTimer);
    };
  }, [country_code, value, inputValue, t, cong_number]);

  return { setValue, value, setInputValue, options, isLoading };
};

export default useCongregation;
