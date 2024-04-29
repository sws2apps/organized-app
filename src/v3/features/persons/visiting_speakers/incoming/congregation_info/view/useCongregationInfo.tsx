import { generateWeekday } from '@services/i18n/translation';
import { CongregationInfoViewType } from './index.types';

const useCongregationInfo = ({ congregation }: CongregationInfoViewType) => {
  const weekdays = generateWeekday();

  const getMidweekTime = () => {
    let result = '';

    const weekDay = congregation.midweek_meeting.weekday.value;

    if (weekDay > 0) {
      result = weekdays[weekDay - 1];
    }

    if (congregation.midweek_meeting.time.value) {
      result += result.length > 0 ? ', ' : '';

      result += congregation.midweek_meeting.time.value;
    }

    return result;
  };

  const getWeekendTime = () => {
    let result = '';

    const weekDay = congregation.weekend_meeting.weekday.value;

    if (weekDay > 0) {
      result = weekdays[weekDay - 1];
    }

    if (congregation.weekend_meeting.time.value) {
      result += result.length > 0 ? ', ' : '';

      result += congregation.weekend_meeting.time.value;
    }

    return result;
  };

  return { midweekTime: getMidweekTime(), weekendTime: getWeekendTime() };
};

export default useCongregationInfo;
