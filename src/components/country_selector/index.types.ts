/**
 * Represents a country with its name and code.
 */
export type CountryType = {
  /** The name of the country. */
  name: string;

  /** The code of the country. */
  code: string;
};

export type CountrySelectorType = {
  handleCountryChange: (value: CountryType) => void;
  value?: CountryType;
  autoLoad?: boolean;
  readOnly?: boolean;
};
