import { store } from '@states/index';
import { userFieldServiceReportsState } from '@states/user_field_service_reports';
import { UserFieldServiceReportType } from '@definition/user_field_service_reports';

export const setUserFieldServiceReports = (
  value: UserFieldServiceReportType[]
) => {
  store.set(userFieldServiceReportsState, value);
};
