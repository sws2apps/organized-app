import { Box } from '@mui/material';
import { MeetingPartType } from './index.types';
import useMeetingPart from './useMeetingPart';
import Typography from '@components/typography';

const MeetingPart = (props: MeetingPartType) => {
  const { source, secondary } = useMeetingPart(props);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <Typography className="h4" color={props.color}>
        {source}
      </Typography>
      {secondary && (
        <Typography className="body-small-regular" color="var(--grey-400)">
          {secondary}
        </Typography>
      )}
    </Box>
  );
};

export default MeetingPart;
