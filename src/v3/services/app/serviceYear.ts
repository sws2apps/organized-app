import { promiseGetRecoil } from 'recoil-outside';
import { serviceYearState } from '@states/serviceYear';
import { addMonths } from '@utils/date';

export const currentReportMonth = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDate = new Date().getDate();

  let month;
  if (currentDate > 20) {
    month = `${currentYear}/${String(currentMonth).padStart(2, '0')}/01`;
  }

  if (currentDate <= 20) {
    const previousMonthDate = addMonths(new Date(), -1);
    month = `${previousMonthDate.getFullYear()}/${String(previousMonthDate.getMonth() + 1).padStart(2, '0')}/01`;
  }

  return month;
};

export const getServiceYearByValue = async (value) => {
  const list = await promiseGetRecoil(serviceYearState);

  return list.find((service) => service.value === value);
};

export const getServiceYearByMonth = async (month) => {
  const currentYear = new Date(month).getFullYear();
  const currentMonth = new Date(month).getMonth() + 1;
  let current;

  if (currentMonth < 9) current = `${+currentYear - 1}-${currentYear}`;
  if (currentMonth >= 9) current = `${currentYear}-${+currentYear + 1}`;

  const found = await getServiceYearByValue(current);

  return found;
};
