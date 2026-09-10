import { AttendanceSummaryProps } from './index.types';
import useMeetingAttendance from '../../hooks/useMeetingAttendance';

const useAttendanceSummary = ({
  month,
  summary,
  type,
}: AttendanceSummaryProps) => {
  const { midweek, weekend } = useMeetingAttendance(month);

  const stats = type === 'midweek' ? midweek : weekend;

  return { value: summary === 'total' ? stats.total : stats.average };
};

export default useAttendanceSummary;
