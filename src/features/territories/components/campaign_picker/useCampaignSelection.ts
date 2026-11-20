import { campaignSections } from '@features/territories/campaign_view';
import { useAtomValue } from 'jotai';
import { useSearchParams } from 'react-router';
import { territoryCampaignsState } from '@features/territories/campaigns';
const useCampaignSelection = () => {
  const [params] = useSearchParams();
  const campaigns = useAtomValue(territoryCampaignsState);
  const id =
    params.get('forCampaign') ??
    params.get('campaign') ??
    (params.get('tab') === 'campaign'
      ? (campaignSections(campaigns).active[0]?.id ??
        campaignSections(campaigns).past[0]?.id)
      : undefined);
  return campaigns.find((campaign) => campaign.id === id);
};
export default useCampaignSelection;
