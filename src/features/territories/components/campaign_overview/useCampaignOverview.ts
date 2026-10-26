import { useState } from 'react';
import { dayOf } from '@features/territories/campaign_dates';
import { useAtomValue } from 'jotai';
import { useSearchParams } from 'react-router';
import { territoryCampaignsState } from '@features/territories/campaigns';
import { campaignSections } from '@features/territories/campaign_view';
import useTerritoryAccess from '@features/territories/useTerritoryAccess';

const useCampaignOverview = () => {
  const campaigns = useAtomValue(territoryCampaignsState);
  const context = useTerritoryAccess();
  const [params, setParams] = useSearchParams();
  const sections = campaignSections(campaigns);
  const selected = campaigns.find((item) => item.id === params.get('event'));
  const [collapsed, setCollapsed] = useState(false);
  const past = selected
    ? selected.end < dayOf(new Date())
    : params.get('period') === 'past';
  const items = past ? sections.past : sections.active;
  const expandedId =
    selected?.id ?? (!collapsed && !past ? items[0]?.id : undefined);
  const setPeriod = (index: number) => {
    setCollapsed(false);
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      next.delete('event');
      next.set('period', index ? 'past' : 'active');
      return next;
    });
  };
  const open = (id?: string) => {
    setCollapsed(!id);
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        next.set('period', past ? 'past' : 'active');
        if (id) next.set('event', id);
        else next.delete('event');
        return next;
      },
      { replace: true }
    );
  };
  return {
    expandedId,
    missing: params.has('event') && !selected,
    past,
    items,
    setPeriod,
    open,
    context,
  };
};
export default useCampaignOverview;
