import { Box, IconButton } from '@mui/material';
import { IconDelete } from '@components/icons';
import { CongregationItemType } from './index.types';
import Typography from '@components/typography';

const CongregationItem = ({ congregation, onDelete }: CongregationItemType) => {
  return (
    <Box
      sx={{
        minHeight: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Typography className="h4">{congregation.cong_name}</Typography>

        {congregation.cong_number && (
          <Typography
            className="body-small-semibold"
            color="var(--grey-400)"
            sx={{ padding: '2px 8px', backgroundColor: 'var(--grey-150)' }}
          >
            {congregation.cong_number}
          </Typography>
        )}
      </Box>

      <IconButton
        sx={{ padding: '2px' }}
        onClick={() => onDelete(congregation)}
      >
        <IconDelete color="var(--red-main)" />
      </IconButton>
    </Box>
  );
};

export default CongregationItem;
