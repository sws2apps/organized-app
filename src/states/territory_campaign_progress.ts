import { atom } from 'jotai';
import type { TerritoryCampaignProgress } from '@definition/territory_campaign_progress';
import { userIDState } from '@states/app';
import { congIDState, userDataViewState } from '@states/settings';

export const territoryCampaignSnapshotState = atom<
  | {
      scope: string;
      progress: TerritoryCampaignProgress[];
    }
  | undefined
>();

export const territoryCampaignProgressState = atom((get) => {
  const snapshot = get(territoryCampaignSnapshotState);
  if (snapshot?.scope !== `${get(congIDState)}:${get(userIDState)}`) return;
  return snapshot.progress.find(
    (view) => view.dataView === get(userDataViewState)
  );
});
