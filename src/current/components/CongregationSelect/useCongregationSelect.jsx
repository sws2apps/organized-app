import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';

const useCongregationSelect = ({ country, fetcher }) => {
  const { t } = useTranslation('ui');

  const queryClient = useQueryClient();

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
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

          await queryClient.prefetchQuery({
            queryKey: ['congregations_by_country'],
            queryFn: () => fetcher(country.code, name),
          });

          const result = queryClient.getQueryData(['congregations_by_country']);

          if (active && result.status === 200) {
            if (Array.isArray(result.data)) setOptions(result.data);
          }

          if (result.status !== 200) {
            setAppSeverity('warning');
            setAppMessage(t('congregationsFetchError'));
            setAppSnackOpen(true);
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
        }, 800);
      }
    } catch (err) {
      setIsLoading(false);
    }

    return () => {
      active = false;
      if (fetchTimer) clearTimeout(fetchTimer);
    };
  }, [country, value, inputValue, queryClient, fetcher, t, setAppSeverity, setAppMessage, setAppSnackOpen]);

  return { options, value, setValue, setInputValue, isLoading };
};

export default useCongregationSelect;
