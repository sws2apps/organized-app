import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiFetchCountries } from '@services/api/congregation';
import { displaySnackNotification } from '@services/recoil/app';
import useAppTranslation from '@hooks/useAppTranslation';

const useCountry = ({ handleCountryChange }) => {
  const queryClient = useQueryClient();

  const { t } = useAppTranslation();

  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [selected, setSelected] = useState(null);

  const options = countries.map((country) => {
    return { name: country.countryName, code: country.countryCode };
  });

  const handleOnChange = (value) => {
    setSelected(value);
    handleCountryChange(value);
  };

  useEffect(() => {
    let active = true;

    if (!isLoading) {
      return undefined;
    }

    const fetchCongregations = async () => {
      setIsLoading(true);
      await queryClient.prefetchQuery({
        queryKey: ['countries'],
        queryFn: apiFetchCountries,
      });
      const result = queryClient.getQueryData(['countries']);

      if (active && result.status === 200) {
        if (Array.isArray(result.data)) setCountries(result.data);
      }

      if (result.status !== 200) {
        await displaySnackNotification({
          message: t('countriesFetchError'),
          severity: 'warning',
        });
      }

      setIsLoading(false);
    };

    fetchCongregations();

    return () => {
      active = false;
    };
  }, [isLoading, queryClient, t]);

  useEffect(() => {
    if (openPicker && countries.length === 0) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [countries, openPicker]);

  return { setOpenPicker, selected, options, handleOnChange, openPicker, isLoading };
};

export default useCountry;
