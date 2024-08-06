import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';
import { OutgoingSpeakersListActiveType } from './index.types';
import CongregationItem from '../congregation_item';

const OutgoingSpeakersListActive = ({
  congregations,
  onDelete,
}: OutgoingSpeakersListActiveType) => {
  const { t } = useAppTranslation();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <Typography color="var(--grey-400)">
        {t('tr_outgoingSpeakersAccessActiveDesc')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          '& > .MuiBox-root': {
            borderBottom: '1px solid var(--accent-200)',
            padding: '10px 0',
          },
          '& > .MuiBox-root:last-child': {
            borderBottom: 'none',
            padding: 0,
          },
        }}
      >
        {congregations.map((congregation) => (
          <CongregationItem
            key={congregation.cong_id}
            congregation={congregation}
            onDelete={onDelete}
          />
        ))}
      </Box>
    </Box>
  );
};

export default OutgoingSpeakersListActive;
