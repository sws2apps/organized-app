import type {
  Territory,
  TerritoryAssignment,
  TerritoryCampaign,
} from '@definition/territory';
import {
  campaignsOn,
  dateOf,
  dayOf,
} from '@features/territories/campaign_dates';

// How far a special campaign has come, from the assignments flagged for it;
// kept free of app imports so the Node test runner can load this file.

export type CampaignFilter = { id: string; worked: boolean };

// a week to bring a territory back once the campaign is over
const GRACE_DAYS = 7;

const flagged = (territory: Territory, id: string) =>
  territory.assignments.filter((assignment) => assignment.campaign?.id === id);

/** Returned at least once for the campaign. */
export const workedInCampaign = (territory: Territory, id: string) =>
  flagged(territory, id).some(
    (assignment) => !!assignment.returnedOn && assignment.completed !== false
  );

/** The open assignment flagged for the campaign, if any. */
export const outForCampaign = (territory: Territory, id: string) =>
  flagged(territory, id).find((assignment) => !assignment.returnedOn);

export const inCampaign = (territory: Territory, id: string) =>
  flagged(territory, id).length > 0;

export const matchesCampaign = (
  territory: Territory,
  filter?: CampaignFilter
) =>
  !filter ||
  (filter.worked
    ? workedInCampaign(territory, filter.id)
    : !workedInCampaign(territory, filter.id) &&
      !outForCampaign(territory, filter.id));

/** Every territory in one bucket: worked, out, or not yet assigned for it. */
export const campaignProgress = (territories: Territory[], id: string) => {
  let worked = 0;
  let out = 0;

  for (const territory of territories) {
    if (workedInCampaign(territory, id)) worked += 1;
    else if (outForCampaign(territory, id)) out += 1;
  }

  return {
    worked,
    out,
    waiting: territories.length - worked - out,
    total: territories.length,
  };
};

const plusDays = (day: string, days: number) => {
  const date = dateOf(day);
  date.setDate(date.getDate() + days);

  return dayOf(date);
};

const campaignOf = (
  assignment: TerritoryAssignment,
  campaigns: TerritoryCampaign[]
) => campaigns.find((campaign) => campaign.id === assignment.campaign?.id);

/** The assignment is open and the campaign it was flagged for is over. */
export const campaignEnded = (
  assignment: TerritoryAssignment,
  campaigns: TerritoryCampaign[],
  today = new Date()
) => {
  if (assignment.returnedOn) return false;

  const campaign = campaignOf(assignment, campaigns);

  return !!campaign && campaign.end < dayOf(today);
};

/** Still out a week after its campaign ended, whatever the usual limit. */
export const campaignOverdue = (
  territory: Territory,
  campaigns: TerritoryCampaign[],
  today = new Date()
) =>
  territory.assignments.some((assignment) => {
    if (assignment.returnedOn) return false;

    const campaign = campaignOf(assignment, campaigns);

    return !!campaign && plusDays(campaign.end, GRACE_DAYS) <= dayOf(today);
  });

/** The one to show first: running today, else the last to end within two months. */
export const currentCampaign = (
  campaigns: TerritoryCampaign[],
  today = new Date()
) => {
  const running = campaignsOn(campaigns, today)[0];
  if (running) return running;

  const day = dayOf(today);
  const oldest = new Date(today);
  oldest.setMonth(oldest.getMonth() - 2);
  const oldestDay = dayOf(oldest);

  return campaigns
    .filter((campaign) => campaign.end < day && campaign.end >= oldestDay)
    .sort((a, b) => b.end.localeCompare(a.end))[0];
};
