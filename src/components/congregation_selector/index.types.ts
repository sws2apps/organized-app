import { CongregationResponseType } from '@definition/api';

export type CongregationSelectorType = {
  country_guid: string;
  setCongregation: (value: CongregationResponseType) => void;
  label?: string;
  cong_name?: string;
  freeSolo?: boolean;
  freeSoloChange?: (cong_name: string) => void;
  freeSoloValue?: string;
  readOnly?: boolean;
};
