import { Box } from '@mui/material';
import { DetailsRowProps } from './index.types';
import useDetailsRow from './useDetailsRow';
import Typography from '@components/typography';

const DetailsRow = (props: DetailsRowProps) => {
  const { label, value } = useDetailsRow(props);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 4px',
        gap: '8px',
      }}
    >
      <Typography color="var(--grey-400)">{label}</Typography>
      <Typography className="h4" sx={{ textWrap: 'nowrap' }}>
        {value}
      </Typography>
    </Box>
  );
};

export default DetailsRow;
