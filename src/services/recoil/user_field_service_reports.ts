import { promiseSetRecoil } from 'recoil-outside';
import { userFieldServiceReportsState } from '@states/user_field_service_reports';
import { UserFieldServiceReportType } from '@definition/user_field_service_reports';

export const setUserFieldServiceReports = async (
  value: UserFieldServiceReportType[]
) => {
  await promiseSetRecoil(userFieldServiceReportsState, value);
};
