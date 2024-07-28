import { WeekHeaderType } from './index.types';
import useWeekHeader from './useWeekHeader';
import Typography from '@components/typography';

const WeekHeader = ({ week }: WeekHeaderType) => {
  const { header } = useWeekHeader(week);

  return <Typography className="h2-caps">{header}</Typography>;
};

export default WeekHeader;
