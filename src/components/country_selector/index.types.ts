/**
 * Represents a country with its name and code.
 */
export type CountryType = {
  name: string;
  code: string;
  guid: string;
};

export type CountrySelectorType = {
  handleCountryChange: (value: CountryType) => void;
  value?: CountryType;
  autoLoad?: boolean;
  readOnly?: boolean;
};
