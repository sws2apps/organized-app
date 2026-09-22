import { Box, Stack } from '@mui/material';
import { Badge, Typography } from '@components/index';
import { Territory, TYPE_LABEL } from '@definition/territory';
import { StatusBadge } from './territory_badges';

const TerritorySummary = ({
  territory,
  meta,
}: {
  territory: Territory;
  meta?: string;
}) => (
  <Stack
    direction="row"
    sx={{ alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}
  >
    <Box sx={{ width: 'fit-content' }}>
      <StatusBadge status={territory.status} />
    </Box>

    <Box sx={{ width: 'fit-content' }}>
      <Badge
        size="small"
        filled={false}
        color="grey"
        text={TYPE_LABEL[territory.type]}
      />
    </Box>

    {meta && (
      <Typography className="label-small-regular" color="var(--grey-350)">
        {meta}
      </Typography>
    )}
  </Stack>
);

export default TerritorySummary;
