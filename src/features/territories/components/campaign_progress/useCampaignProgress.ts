import { useAtomValue } from 'jotai';
import {
  territoriesWithStatusState,
  territoryLocalModeState,
} from '@states/territories';
import { territoryCampaignProgressState } from '@states/territory_campaign_progress';
import useTerritoryAccess from '@features/territories/useTerritoryAccess';
import { campaignProgress } from '@features/territories/campaign_filter';

const useCampaignProgress = (campaignId: string) => {
  const territories = useAtomValue(territoriesWithStatusState);
  const local = useAtomValue(territoryLocalModeState);
  const snapshot = useAtomValue(territoryCampaignProgressState);
  const { editor } = useTerritoryAccess();
  if (local || editor) return campaignProgress(territories, campaignId);
  // Permission-filtered records cannot provide congregation-wide totals.
  if (!snapshot) return;
  const campaign = snapshot.campaigns.find(
    (item) => item.campaignId === campaignId
  );
  const worked = campaign?.worked ?? 0;
  const out = campaign?.out ?? 0;
  return {
    worked,
    out,
    total: snapshot.total,
    waiting: snapshot.total - worked - out,
  };
};
export default useCampaignProgress;
