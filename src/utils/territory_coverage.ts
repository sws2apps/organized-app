import type { TerritoryAssignment } from '@definition/territory';
export const isTerritoryCoverage = (
  assignment: Pick<TerritoryAssignment, 'completed' | 'campaign'>
) =>
  assignment.completed !== false &&
  (!assignment.campaign || assignment.campaign.coverage === true);
