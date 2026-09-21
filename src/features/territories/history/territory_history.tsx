import { Box, Stack } from '@mui/material';
import { Badge, Typography } from '@components/index';
import Card from '@components/card';
import { daysLabel } from '../helpers';
import TerritoryAssignments from '../details/territory_assignments';
import { StatusBadge } from '../components/territory_badges';
import { Territory, TYPE_LABEL } from '@definition/territory';

const TerritoryHistory = ({ territory }: { territory: Territory }) => (
  <Card>
    <Stack spacing="4px">
      <Typography className="h4" color="var(--black)">
        Territory {territory.number}
      </Typography>
      <Typography className="body-small-regular" color="var(--grey-400)">
        {territory.name} · {territory.city}
      </Typography>
    </Stack>

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
      <Typography className="label-small-regular" color="var(--grey-350)">
        Last covered {daysLabel(territory.daysSinceCovered)} ago
      </Typography>
    </Stack>

    <TerritoryAssignments territory={territory} />
  </Card>
);

export default TerritoryHistory;
