import { Box, Typography } from '@mui/material';
import { UpcomingEventDateProps } from './index.types';
import useUpcomingEventDate from './useUpcomingEventDate';
import { useBreakpoints } from '@hooks/index';

const UpcomingEventDate = (props: UpcomingEventDateProps) => {
  const { laptopDown } = useBreakpoints();
  const { formatEventDateDate, formatEventDateTime, startTime, endTime } =
    useUpcomingEventDate(props);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: laptopDown ? 'column' : 'row',
        gap: '16px',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'var(--accent-150)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-s)',
          gap: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography className="h4" color="var(--accent-dark)">
          {formatEventDateDate(startTime)}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '4px',
        }}
      >
        <Typography className="h4" color="var(--black)">
          {formatEventDateTime(startTime, endTime)}
        </Typography>
        <Typography className="body-regular" color="var(--grey-400)">
          {props.data.comment}
        </Typography>
      </Box>
    </Box>
  );
};

export default UpcomingEventDate;
