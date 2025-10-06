import { CountryResponseType } from '@definition/api';

export type CountrySelectorType = {
  handleCountryChange: (value: CountryResponseType) => void;
  value?: CountryResponseType;
  autoLoad?: boolean;
  readOnly?: boolean;
};
