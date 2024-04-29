import { Box } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import { buildPersonFullname } from '@utils/common';
import { SpeakerReadOnlyViewType } from './index.types';
import useView from './useView';
import Typography from '@components/typography';

const IncomingSpeakerView = ({ speaker }: SpeakerReadOnlyViewType) => {
  const { mobile400Down } = useBreakpoints();

  const { talks, fullnameOption } = useView(speaker);

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
      <Typography
        className="body-small-regular"
        sx={{ minWidth: mobile400Down ? 'unset' : '220px', width: mobile400Down ? 'unset' : '220px' }}
      >
        {buildPersonFullname(speaker.person_lastname.value, speaker.person_firstname.value, fullnameOption)}
      </Typography>
      <Typography className="body-small-semibold">{talks}</Typography>
    </Box>
  );
};

export default IncomingSpeakerView;
