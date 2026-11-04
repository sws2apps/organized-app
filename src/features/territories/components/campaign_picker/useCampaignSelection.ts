import { useAtomValue } from 'jotai';
import { useSearchParams } from 'react-router';
import { territoryCampaignsState } from '@features/territories/campaigns';
const useCampaignSelection = () => {
  const [params] = useSearchParams();
  const campaigns = useAtomValue(territoryCampaignsState);
  const id = params.get('forCampaign') ?? params.get('campaign');
  return campaigns.find((campaign) => campaign.id === id);
};
export default useCampaignSelection;
