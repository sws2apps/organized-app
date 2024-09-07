import { RowContainer } from './index.styles';
import { StatsRowProps } from './index.types';
import Typography from '@components/typography';

const StatsRow = ({ title, value, color, sx, colorValue }: StatsRowProps) => {
  return (
    <RowContainer sx={sx}>
      <Typography color={color}>{title}</Typography>
      <Typography className="h4" color={colorValue && color}>
        {value}
      </Typography>
    </RowContainer>
  );
};

export default StatsRow;
