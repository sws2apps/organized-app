import { generateWeekday } from '@services/i18n/translation';

const useDaySeletor = () => {
  const options = generateWeekday();

  return { options };
};

export default useDaySeletor;
