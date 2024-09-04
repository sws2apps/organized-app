import { RowContainer } from './index.styles';
import { RowStatsProps } from './index.types';
import Typography from '@components/typography';

const RowStats = ({ title, value, color, sx }: RowStatsProps) => {
  return (
    <RowContainer sx={sx}>
      <Typography color={color}>{title}</Typography>
      <Typography className="h4">{value}</Typography>
    </RowContainer>
  );
};

export default RowStats;
