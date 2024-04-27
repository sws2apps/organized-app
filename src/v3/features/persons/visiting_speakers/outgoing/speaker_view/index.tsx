import { Box } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import { SpeakerReadOnlyViewType } from './index.types';
import Typography from '@components/typography';
import useView from './useView';

const SpeakerReadOnlyView = ({ speaker }: SpeakerReadOnlyViewType) => {
  const { talks } = useView(speaker);

  const { mobile400Down } = useBreakpoints();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: mobile400Down ? 'flex-start' : 'center',
        gap: '8px',
        padding: '8px',
        flexDirection: mobile400Down ? 'column' : 'row',
      }}
    >
      <Typography sx={{ minWidth: mobile400Down ? 'unset' : '250px', width: mobile400Down ? 'unset' : '250px' }}>
        {speaker.person_display_name.value}
      </Typography>
      <Typography className="body-small-semibold">{talks}</Typography>
    </Box>
  );
};

export default SpeakerReadOnlyView;
