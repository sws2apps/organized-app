import { WeekHeaderType } from './index.types';
import useWeekHeader from './useWeekHeader';
import Typography from '@components/typography';

const WeekHeader = (props: WeekHeaderType) => {
  const { header } = useWeekHeader(props);

  return <Typography className="h2-caps">{header}</Typography>;
};

export default WeekHeader;
