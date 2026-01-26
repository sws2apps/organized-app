export const getCSVDelimiterByNumberFormat = (): string => {
  // Check the decimal separator of the current locale
  const numberFormatter = new Intl.NumberFormat();
  const formattedNumber = numberFormatter.format(1.1);

  // If comma is used as the decimal separator, use semicolon for CSV
  return formattedNumber.includes(',') ? ';' : ',';
};

export const arrayInCsvSeparator = (): string => {
  return getCSVDelimiterByNumberFormat() === ',' ? ';' : ',';
};
