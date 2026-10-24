import { useAtomValue } from 'jotai';
import { weekTypeLocaleState } from '@states/weekType';
import { Week } from '@definition/week_type';
import { WeekTypeBadgeProps } from './index.types';
import Badge from '@components/badge';

const WeekTypeBadge = ({ weekType }: WeekTypeBadgeProps) => {
  const weekTypeOptions = useAtomValue(weekTypeLocaleState);

  if (weekType === Week.NORMAL) return null;

  const weekTypeRecord = weekTypeOptions.find(
    (record) => record.id === weekType
  );

  if (!weekTypeRecord) return null;

  return (
    <Badge
      text={weekTypeRecord.week_type_name}
      color="orange"
      size="small"
      filled={false}
      className="label-small-regular"
      sx={{ width: 'fit-content' }}
    />
  );
};

export default WeekTypeBadge;
