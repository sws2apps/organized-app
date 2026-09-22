import { ListItem } from '@mui/material';
import {
  IconAssign,
  IconMap,
  IconMapOverview,
  IconMapView,
  IconRaiseHand,
  IconStatsYear,
} from '@icons/index';
import { useAtomValue } from 'jotai';
import { useBreakpoints, useCurrentUser } from '@hooks/index';
import { territoriesState } from '@states/territories';
import { forTab } from '@features/territories/helpers';
import DashboardCard from '@features/dashboard/card';
import DashboardMenu from '@features/dashboard/menu';

const TerritoriesCard = () => {
  const { isElder, isServiceCommittee } = useCurrentUser();
  const { laptopUp } = useBreakpoints();

  const territories = useAtomValue(territoriesState);

  const isTerritoryEditor = isElder || isServiceCommittee;

  const mine = forTab(territories, 'mine').length;
  const requests = forTab(territories, 'requests').length;
  const recommended = forTab(territories, 'recommended').length;

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
      {isTerritoryEditor && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconRaiseHand color="var(--black)" />}
            primaryText="Requests"
            badgeText={String(requests)}
            path="/territories?tab=requests"
          />
        </ListItem>
      )}
      <ListItem disablePadding>
        {isTerritoryEditor ? (
          <DashboardMenu
            icon={<IconMapOverview color="var(--black)" />}
            primaryText="All territories"
            badgeText={String(territories.length)}
            path="/territories?tab=all"
          />
        ) : (
          <DashboardMenu
            icon={<IconAssign color="var(--black)" />}
            primaryText="Get territory"
            badgeText={String(recommended)}
            path="/territories?tab=recommended"
          />
        )}
      </ListItem>
      {isTerritoryEditor && laptopUp && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconMapView color="var(--black)" />}
            primaryText="Coverage map"
            path="/territories/map"
          />
        </ListItem>
      )}
      {isTerritoryEditor && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconStatsYear color="var(--black)" />}
            primaryText="Statistics"
            path="/territories/statistics"
          />
        </ListItem>
      )}
    </DashboardCard>
  );
};

export default TerritoriesCard;
