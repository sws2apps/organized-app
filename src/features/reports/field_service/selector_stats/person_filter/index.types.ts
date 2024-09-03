import { PersonFilterOption } from '@definition/cong_field_service_reports';

export type FilterType = {
  key: string;
  options: {
    key: PersonFilterOption;
    name: string;
  }[];
};
