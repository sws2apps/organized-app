import { generateWeekday } from '@services/i18n/translation';
import { CongregationInfoViewType } from './index.types';

const useCongregationInfo = ({ congregation }: CongregationInfoViewType) => {
  const weekdays = generateWeekday();

  const getMidweekTime = () => {
    let result = '';

    const weekDay = congregation.cong_data.midweek_meeting.weekday.value;

    if (weekDay > 0) {
      result = weekdays[weekDay];
    }

    if (congregation.cong_data.midweek_meeting.time.value) {
      result += result.length > 0 ? ', ' : '';

      result += congregation.cong_data.midweek_meeting.time.value;
    }

    return result;
  };

  const getWeekendTime = () => {
    let result = '';

    let weekDay = congregation.cong_data.weekend_meeting.weekday.value;

    if (weekDay > 6) weekDay = 6;

    if (weekDay > 0) {
      result = weekdays[weekDay];
    }

    if (congregation.cong_data.weekend_meeting.time.value) {
      result += result.length > 0 ? ', ' : '';

      result += congregation.cong_data.weekend_meeting.time.value;
    }

    return result;
  };

  return { midweekTime: getMidweekTime(), weekendTime: getWeekendTime() };
};

export default useCongregationInfo;
