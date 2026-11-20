import { differenceInCalendarDays } from 'date-fns';
import type { Territory, TerritoryCampaign } from '@definition/territory';
import {
  campaignsOn,
  dateOf,
  dayOf,
} from '@features/territories/campaign_dates';
import {
  outForCampaign,
  workedInCampaign,
} from '@features/territories/campaign_filter';

export type CampaignStatus = 'all' | 'waiting' | 'assigned' | 'completed';
export const CAMPAIGN_STATUSES: CampaignStatus[] = [
  'all',
  'waiting',
  'assigned',
  'completed',
];

export const campaignSections = (
  campaigns: TerritoryCampaign[],
  today = new Date()
) => {
  const day = dayOf(today);
  const running = campaignsOn(campaigns, today);
  const upcoming = campaigns
    .filter((item) => item.start > day)
    .sort(
      (a, b) => a.start.localeCompare(b.start) || a.name.localeCompare(b.name)
    );
  const past = campaigns
    .filter((item) => item.end < day)
    .sort((a, b) => b.end.localeCompare(a.end));
  return { active: [...running, ...upcoming], past };
};

export const campaignStartsIn = (
  campaign: TerritoryCampaign,
  today = new Date()
) => Math.max(0, differenceInCalendarDays(dateOf(campaign.start), today));

export const campaignStatus = (
  territory: Territory,
  id: string
): Exclude<CampaignStatus, 'all'> => {
  if (workedInCampaign(territory, id)) return 'completed';
  if (outForCampaign(territory, id)) return 'assigned';
  return 'waiting';
};

export const matchesCampaignStatus = (
  territory: Territory,
  id: string,
  status: CampaignStatus
) => status === 'all' || campaignStatus(territory, id) === status;
