import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { TerritoryAssignment } from '@definition/territory';
import { territoryCampaignsState } from '@features/territories/campaigns';
import { campaignSections } from '@features/territories/campaign_view';

type Campaign = TerritoryAssignment['campaign'];

const useCampaignPicker = (
  value: Campaign,
  onChange: (value?: Campaign) => void
) => {
  const campaigns = useAtomValue(territoryCampaignsState);
  const [previous, setPrevious] = useState<Campaign>(value);
  const sections = campaignSections(campaigns);
  const options = [...sections.active, ...sections.past];
  const selected = options.find((item) => item.id === value?.id);

  const handleToggle = (checked: boolean) => {
    if (!checked) {
      setPrevious(value);
      onChange(undefined);
      return;
    }

    const campaign =
      options.find((item) => item.id === previous?.id) ?? previous ?? options[0];
    if (campaign) onChange({ id: campaign.id, name: campaign.name });
  };

  const handleSelect = (id: string) => {
    const campaign = options.find((item) => item.id === id);
    if (campaign) onChange({ id: campaign.id, name: campaign.name });
  };

  return {
    options,
    displayed: selected ?? value ?? previous ?? options[0],
    canEnable: options.length > 0 || !!previous || !!value,
    handleToggle,
    handleSelect,
  };
};

export default useCampaignPicker;
