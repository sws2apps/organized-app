import type {
  TerritoryAssignment,
  TerritoryCampaign,
} from '@definition/territory';

// Campaign days are yyyy-mm-dd, so they compare as text; kept free of app
// imports so the Node test runner can load this file.

const pad = (value: number) => String(value).padStart(2, '0');

/** A date as its local calendar day, yyyy-mm-dd. */
export const dayOf = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** A calendar day as a local Date, at midnight. */
export const dateOf = (day: string) => {
  const [year, month, date] = day.split('-').map(Number);

  return new Date(year, month - 1, date);
};

const latestStartFirst = (a: TerritoryCampaign, b: TerritoryCampaign) =>
  b.start.localeCompare(a.start);

const isRunning = (campaign: TerritoryCampaign, day: string) =>
  campaign.start <= day && day <= campaign.end;

/** The campaigns that include the day, latest start first. */
export const campaignsOn = (campaigns: TerritoryCampaign[], date: Date) => {
  const day = dayOf(date);

  return campaigns
    .filter((campaign) => isRunning(campaign, day))
    .sort(latestStartFirst);
};

/**
 * The pre-selection rule: an assignment made on a day inside a campaign is
 * filed under it, the latest start when several run; outside one it isn't.
 */
export const campaignFor = (campaigns: TerritoryCampaign[], date: Date) =>
  campaignsOn(campaigns, date).at(0);

/** What an assignment keeps of its campaign, so history survives a rename or deletion. */
export const campaignSnapshot = (
  campaign: Pick<TerritoryCampaign, 'id' | 'name'>,
  coverage = false
): NonNullable<TerritoryAssignment['campaign']> => ({
  id: campaign.id,
  name: campaign.name,
  ...(coverage ? { coverage } : {}),
});

/**
 * What an assignment can be filed under: the campaigns running today, the
 * upcoming ones, and those that ended within the last 12 months.
 */
export const campaignChoices = (
  campaigns: TerritoryCampaign[],
  today: Date
) => {
  const day = dayOf(today);
  const oldest = new Date(today);
  oldest.setMonth(oldest.getMonth() - 12);
  const oldestDay = dayOf(oldest);

  const running = campaigns
    .filter((campaign) => isRunning(campaign, day))
    .sort(latestStartFirst);
  const upcoming = campaigns
    .filter((campaign) => campaign.start > day)
    .sort((a, b) => a.start.localeCompare(b.start));
  const recent = campaigns
    .filter((campaign) => campaign.end < day && campaign.end >= oldestDay)
    .sort((a, b) => b.end.localeCompare(a.end));

  return [...running, ...upcoming, ...recent];
};

/** "1–21 March"; the year only when it isn't this one */
export const campaignRange = (campaign: TerritoryCampaign, locale: string) => {
  const start = dateOf(campaign.start);
  const end = dateOf(campaign.end);
  const thisYear = new Date().getFullYear();
  const withYear =
    start.getFullYear() !== thisYear || end.getFullYear() !== thisYear;

  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    ...(withYear ? { year: 'numeric' } : {}),
  }).formatRange(start, end);
};

/** "Memorial invitations · 1–21 March" */
export const campaignLabel = (campaign: TerritoryCampaign, locale: string) =>
  `${campaign.name} · ${campaignRange(campaign, locale)}`;

/** Whether the campaign and the span from..to share a day. */
export const campaignOverlaps = (
  campaign: TerritoryCampaign,
  from: Date,
  to: Date
) => dayOf(from) <= campaign.end && dayOf(to) >= campaign.start;
