import { ListItem } from '@mui/material';
import {
  IconHeatmap,
  IconLocationPerson,
  IconMap,
  IconMapOverview,
} from '@icons/index';
import { useAtomValue } from 'jotai';
import { territoriesState } from '@states/territories';
import { forTab } from '@features/territories/helpers';
import DashboardCard from '@features/dashboard/card';
import DashboardMenu from '@features/dashboard/menu';

const TerritoriesCard = () => {
  const territories = useAtomValue(territoriesState);

  const recommended = forTab(territories, 'recommended').length;
  const overdue = forTab(territories, 'overdue').length;
  const mine = forTab(territories, 'mine').length;

  return (
    <DashboardCard header="Territories">
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconMap color="var(--black)" />}
          primaryText="My territories"
          badgeText={String(mine)}
          path="/territories?tab=mine"
        />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconLocationPerson color="var(--black)" />}
          primaryText="Recommended"
          badgeText={String(recommended)}
          path="/territories?tab=recommended"
        />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconMapOverview color="var(--black)" />}
          primaryText="All territories"
          badgeText={String(territories.length)}
          path="/territories?tab=all"
        />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconHeatmap color="var(--black)" />}
          primaryText="Overdue"
          badgeText={String(overdue)}
          path="/territories?tab=overdue"
        />
      </ListItem>
    </DashboardCard>
  );
};

export default TerritoriesCard;
