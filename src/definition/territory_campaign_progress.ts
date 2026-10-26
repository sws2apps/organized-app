/** Counts include all congregation territories in this data view, without private records. */
export type TerritoryCampaignProgress = {
  dataView: string;
  total: number;
  campaigns: { campaignId: string; worked: number; out: number }[];
};
