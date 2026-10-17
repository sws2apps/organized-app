import { Stack } from '@mui/material';
import { Typography } from '@components/index';
import Card from '@components/card';
import { daysLabel } from '../helpers';
import TerritoryAssignments from '../details/territory_assignments';
import TerritorySummary from '../components/territory_summary';
import { Territory } from '@definition/territory';

const TerritoryHistory = ({ territory }: { territory: Territory }) => (
  <Card>
    <Stack spacing="4px">
      <Typography className="h2" color="var(--black)">
        Territory {territory.number}
      </Typography>
      <Typography className="body-small-regular" color="var(--grey-400)">
        {territory.name} · {territory.city}
      </Typography>
    </Stack>

    <TerritorySummary
      territory={territory}
      meta={`Last covered ${daysLabel(territory.daysSinceCovered)} ago`}
    />

    <TerritoryAssignments territory={territory} />
  </Card>
);

export default TerritoryHistory;
