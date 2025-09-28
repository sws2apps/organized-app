import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { useQueryClient } from '@tanstack/react-query';
import { apiFetchCountries } from '@services/api/congregation';
import { displaySnackNotification } from '@services/states/app';
import { CountryResponseType } from '@definition/api';
import { CountrySelectorType } from './index.types';
import { getMessageByCode } from '@services/i18n/translation';
import { countriesState } from '@states/app';

/**
 * Hook for managing country data and selection.
 * @param {Object} props - Props for the useCountry hook.
 * @param {(value: CountryType) => void} props.handleCountryChange - Function to handle country change.
 * @returns {Object} Object containing country data and selection state.
 */
const useCountry = ({
  handleCountryChange,
  value,
  autoLoad,
}: CountrySelectorType) => {
  const queryClient = useQueryClient();

  const [countries, setCountries] = useAtom(countriesState);

  const [isLoading, setIsLoading] = useState(autoLoad ?? false);
  const [openPicker, setOpenPicker] = useState(false);
  const [selected, setSelected] = useState<CountryResponseType>(value || null);

  const handleOnChange = (value: CountryResponseType) => {
    setSelected(value);
    handleCountryChange(value);
  };

  useEffect(() => {
    setIsLoading(autoLoad ?? false);
  }, [autoLoad]);

  useEffect(() => {
    let active = true;

    if (!isLoading) {
      return undefined;
    }

    const fetchCountries = async () => {
      setIsLoading(true);
      await queryClient.prefetchQuery({
        queryKey: ['countries'],
        queryFn: apiFetchCountries,
      });

      const result: { status: number; data: CountryResponseType[] } =
        queryClient.getQueryData(['countries']);

      if (active && result.status === 200) {
        if (Array.isArray(result.data)) setCountries(result.data);
      }

      if (result.status !== 200) {
        displaySnackNotification({
          header: getMessageByCode('error_app_generic-title'),
          message: getMessageByCode('error_app_country-search-error'),
          severity: 'error',
        });
      }

      setIsLoading(false);
    };

    fetchCountries();

    return () => {
      active = false;
    };
  }, [isLoading, queryClient, setCountries]);

  useEffect(() => {
    if (countries.length === 0) {
      setSelected(null);
      return;
    }

    if (value === null) {
      setSelected(null);
      return;
    }

    const findValue = countries.find(
      (country) =>
        country.countryCode === value.countryCode ||
        country.countryGuid === value.countryGuid
    );

    setSelected(findValue ?? null);
  }, [countries, value]);

  useEffect(() => {
    if (!autoLoad) {
      if (openPicker && countries.length === 0) {
        setIsLoading(true);
      } else {
        setIsLoading(false);
      }
    }
  }, [autoLoad, countries, openPicker]);

  return {
    setOpenPicker,
    selected,
    countries,
    handleOnChange,
    openPicker,
    isLoading,
  };
};

export default useCountry;
