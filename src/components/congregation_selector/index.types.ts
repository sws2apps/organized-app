import { CongregationResponseType } from '@definition/api';

export type CongregationSelectorType = {
  country_code: string;
  setCongregation: (value: CongregationResponseType) => void;
  label?: string;
  cong_number?: string;
  freeSolo?: boolean;
  freeSoloChange?: (cong_name: string) => void;
  freeSoloValue?: string;
  readOnly?: boolean;
};
