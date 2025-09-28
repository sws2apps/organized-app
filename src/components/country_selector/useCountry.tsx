import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiFetchCountries } from '@services/api/congregation';
import { displaySnackNotification } from '@services/states/app';
import { CountryResponseType } from '@definition/api';
import { CountrySelectorType, CountryType } from './index.types';
import { getMessageByCode } from '@services/i18n/translation';
import useAppTranslation from '@hooks/useAppTranslation';

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

  const { t } = useAppTranslation();

  const [countries, setCountries] = useState<CountryResponseType[]>([]);
  const [isLoading, setIsLoading] = useState(autoLoad ?? false);
  const [openPicker, setOpenPicker] = useState(false);
  const [selected, setSelected] = useState<CountryType>(value || null);

  const options: CountryType[] = countries.map(
    (country: CountryResponseType) => {
      return {
        name: country.countryName,
        code: country.countryCode,
        guid: country.countryGuid,
      };
    }
  );

  const handleOnChange = (value: CountryType) => {
    setSelected(value);
    handleCountryChange(value);
  };

  useEffect(() => {
    if (countries.length > 0) {
      const selected = countries.find(
        (record) => record.countryGuid === value?.guid
      );

      setSelected(
        selected
          ? {
              code: selected.countryCode,
              name: selected.countryName,
              guid: selected.countryGuid,
            }
          : null
      );
    }
  }, [value, countries]);

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
  }, [isLoading, queryClient, t]);

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
    options,
    handleOnChange,
    openPicker,
    isLoading,
  };
};

export default useCountry;
