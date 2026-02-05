import Badge from '@components/badge';
import { PartTimingProps } from './index.types';

const PartTiming = ({ time }: PartTimingProps) => {
  return (
    <Badge
      size="small"
      color="grey"
      text={time}
      centerContent
      className="label-small-medium"
      sx={{
        width: '45px',
        borderRadius: 'var(--radius-max)',
        padding: '12px 6px',
      }}
    />
  );
};

export default PartTiming;
