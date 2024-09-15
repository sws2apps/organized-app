import { useEffect, useState } from 'react';
import { IncomingCongregationResponseType } from '@definition/api';
import { apiFindCongregationSpeakers } from '@services/api/visitingSpeakers';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';

const useOnline = () => {
  const { t } = useAppTranslation();

  const [value, setValue] = useState<IncomingCongregationResponseType>(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<IncomingCongregationResponseType[]>(
    []
  );
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

          const { data, status } = await apiFindCongregationSpeakers(name);

          if (status !== 200) {
            await displaySnackNotification({
              header: t('tr_errorTitle'),
              message: t('tr_congregationsFetchError'),
              severity: 'error',
            });
          }

          if (active && status === 200) {
            setOptions(data);
          }

          setIsLoading(false);
        } catch (err) {
          setIsLoading(false);
          throw new Error(err);
        }
      };

      const testValue = value ? `${value.cong_name}, ${value.cong_number}` : '';
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
  }, [value, inputValue, t]);

  return { setValue, value, setInputValue, options, isLoading };
};

export default useOnline;
