import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiFetchCongregations } from '@services/api/congregation';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';
import { CongregationResponseType } from '@definition/api';
import { CountryType } from '../country_selector/index.types';

const useCongregation = ({ country }: { country: CountryType }) => {
  const queryClient = useQueryClient();

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

          await queryClient.prefetchQuery({
            queryKey: ['congregations_by_country'],
            queryFn: () => apiFetchCongregations(country.code, name),
          });

          const result: { status: number; data: CongregationResponseType[] } = queryClient.getQueryData([
            'congregations_by_country',
          ]);

          if (active && result.status === 200) {
            if (Array.isArray(result.data)) setOptions(result.data);
          }

          if (result.status !== 200) {
            await displaySnackNotification({
              header: t('tr_errorTitle'),
              message: t('tr_congregationsFetchError'),
              severity: 'error',
            });
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
  }, [country, value, inputValue, queryClient, t]);

  return { setValue, value, setInputValue, options, isLoading };
};

export default useCongregation;
