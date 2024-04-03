import { promiseGetRecoil } from 'recoil-outside';
import { fieldServiceReportsState } from '@states/fieldServiceReports';

export const getPublisherS21 = async (service_year, person_uid) => {
  const list = await promiseGetRecoil(fieldServiceReportsState);

  return list.find((item) => item.service_year === service_year && item.person_uid === person_uid);
};

export const isPublisherHasReport = async ({ service_year, person_uid, month }) => {
  const publisherReport = await getPublisherS21(service_year, person_uid);
  const currentMonth = publisherReport.months.find((item) => item.month_value === month);

  const exist = false;
  if (currentMonth) {
    if (currentMonth.hours !== '') {
      return true;
    }

    if (currentMonth.minutes !== '') {
      return true;
    }
  }

  return exist;
};
