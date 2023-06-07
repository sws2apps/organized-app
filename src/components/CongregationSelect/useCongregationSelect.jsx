import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const useCongregationSelect = ({ country, fetcher }) => {
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
        try {
          setIsLoading(true);

          await queryClient.prefetchQuery({
            queryKey: ['congregations_by_country'],
            queryFn: () => fetcher(country.code, name),
          });

          const tmpCongregations = queryClient.getQueryData(['congregations_by_country']);

          if (active) {
            setOptions(tmpCongregations.data);
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
        }, 2000);
      }
    } catch (err) {
      setIsLoading(false);
    }

    return () => {
      active = false;
      if (fetchTimer) clearTimeout(fetchTimer);
    };
  }, [country, value, inputValue, queryClient, fetcher]);

  return { options, value, setValue, setInputValue, isLoading };
};

export default useCongregationSelect;
