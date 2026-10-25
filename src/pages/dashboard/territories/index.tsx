import { useAppTranslation } from '@hooks/index';
import { ListItem } from '@mui/material';
import {
  IconAssign,
  IconAssignmetHistory,
  IconCancelCicle,
  IconCampaign,
  IconMap,
  IconMapOverview,
  IconMapView,
  IconRaiseHand,
  IconStatsYear,
} from '@icons/index';
import { useAtomValue } from 'jotai';
import useTerritoryAccess from '@features/territories/useTerritoryAccess';
import { territoriesState } from '@states/territories';
import { forTab } from '@features/territories/helpers';
import DashboardCard from '@features/dashboard/card';
import DashboardMenu from '@features/dashboard/menu';

const TerritoriesCard = () => {
  const { t } = useAppTranslation();

  const {
    editor: isTerritoryEditor,
    access,
    publisher,
    restricted,
  } = useTerritoryAccess();

  const territories = useAtomValue(territoriesState);

  const mine = forTab(
    territories,
    'mine',
    publisher,
    false,
    undefined,
    restricted
  ).length;
  const requests = forTab(territories, 'requests', publisher).length;
  const recommended = forTab(
    territories,
    'recommended',
    publisher,
    isTerritoryEditor,
    undefined,
    restricted
  ).length;

  return (
    <DashboardCard header={t('tr_territories')}>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconMap color="var(--black)" />}
          primaryText={t('tr_myTerritories')}
          badgeText={String(mine)}
          path="/territories?tab=mine"
        />
      </ListItem>
      {isTerritoryEditor && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconRaiseHand color="var(--black)" />}
            primaryText={t('tr_territoryRequests')}
            badgeText={String(requests)}
            path="/territories?tab=requests"
          />
        </ListItem>
      )}
      {(isTerritoryEditor || access !== 'own') && (
        <ListItem disablePadding>
          {isTerritoryEditor ? (
            <DashboardMenu
              icon={<IconMapOverview color="var(--black)" />}
              primaryText={t('tr_allTerritories')}
              badgeText={String(territories.length)}
              path="/territories?tab=all"
            />
          ) : (
            <DashboardMenu
              icon={<IconAssign color="var(--black)" />}
              primaryText={t('tr_territoryGetTerritory')}
              badgeText={String(recommended)}
              path="/territories?tab=recommended"
            />
          )}
        </ListItem>
      )}
      {isTerritoryEditor && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconCancelCicle color="var(--black)" />}
            primaryText={t('tr_territoryDoNotCallLabel')}
            path="/territories/do-not-calls"
          />
        </ListItem>
      )}
      {isTerritoryEditor && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconMapView color="var(--black)" />}
            primaryText={t('tr_territoryCoverageMap')}
            path="/territories/map"
          />
        </ListItem>
      )}
      {isTerritoryEditor && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconCampaign color="var(--black)" />}
            primaryText={t('tr_territoryCampaigns')}
            path="/territories/campaigns"
          />
        </ListItem>
      )}
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconAssignmetHistory color="var(--black)" />}
          primaryText={t('tr_assignmentHistory')}
          path="/territories/history"
        />
      </ListItem>
      {isTerritoryEditor && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconStatsYear color="var(--black)" />}
            primaryText={t('tr_statistics')}
            path="/territories/statistics"
          />
        </ListItem>
      )}
    </DashboardCard>
  );
};

export default TerritoriesCard;
