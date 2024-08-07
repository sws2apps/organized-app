import { generateWeekday } from '@services/i18n/translation';

const useMeetingTime = () => {
  const options = generateWeekday();

  return { options };
};

export default useMeetingTime;
