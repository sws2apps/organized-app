import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiFetchCongregations } from '../../api';

const useCongregationSelect = ({ country }) => {
  const queryClient = useQueryClient();

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
        setIsLoading(true);
        await queryClient.prefetchQuery({
          queryKey: ['congregations_by_country'],
          queryFn: () => apiFetchCongregations(country.code, name),
        });
        const tmpCongregations = queryClient.getQueryData(['congregations_by_country']);
        if (active) {
          setOptions(tmpCongregations.data);
        }

        setIsLoading(false);
      };

      const testValue = value ? `(${value.congNumber}) ${value.congName}` : '';
      if (inputValue !== testValue) {
        fetchTimer = setTimeout(() => {
          fetchCongregations(inputValue);
        }, 2000);
      }
    } catch (err) {
      setIsLoading(false);
    }

    return () => {
      active = false;
      if (fetchTimer) clearTimeout(fetchTimer);
    };
  }, [country, value, inputValue, queryClient]);

  return { options, value, setValue, setInputValue, isLoading };
};

export default useCongregationSelect;
