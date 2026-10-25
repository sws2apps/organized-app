import { congIDState } from '@states/settings';
import { userIDState } from '@states/app';
import { useState } from 'react';
import { useAtomValue } from 'jotai';
import type { TerritoryPendingReview } from '@definition/territory_sync';
import {
  territorySyncPendingState,
  territorySyncStatusState,
} from '@states/territory_sync';
import { territoryLocalModeState } from '@states/territories';
import { dbTerritorySyncGet } from '@services/dexie/territory_sync';
import { discardPendingTerritories } from '@services/app/territory_sync';
import { exportFile } from '@services/files/export';

const useTerritorySyncStatus = () => {
  const scope = `${useAtomValue(congIDState)}:${useAtomValue(userIDState)}`;
  const [reviewScope, setReviewScope] = useState('');
  const status = useAtomValue(territorySyncStatusState);
  const pending = useAtomValue(territorySyncPendingState);
  const local = useAtomValue(territoryLocalModeState);
  const [review, setReview] = useState<TerritoryPendingReview>();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const openReview = async () => {
    try {
      const data = await dbTerritorySyncGet();
      if (data?.scope !== scope) return;
      setReviewScope(scope);
      setReview({
        queue: data.queue,
        settings: data.settingsDirty ? data.settings : undefined,
      });
      setFailed(false);
    } catch {
      setFailed(true);
    }
  };
  const exportDraft = async () => {
    if (reviewScope !== scope) return;
    try {
      await exportFile(
        new Blob(
          [
            JSON.stringify(
              {
                version: 1,
                operations: review?.queue,
                settings: review?.settings,
              },
              null,
              2
            ),
          ],
          { type: 'application/json' }
        ),
        'territory-pending-changes.json'
      );
    } catch {
      setFailed(true);
    }
  };
  const discard = async () => {
    if (!review || reviewScope !== scope) return;
    setBusy(true);
    setFailed(false);
    try {
      await discardPendingTerritories(review);
      setReview(undefined);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };
  const territories = [
    ...new Map(
      (review?.queue ?? []).flatMap((item) =>
        item.changes.map(
          (change) => [change.id, change.after ?? change.before] as const
        )
      )
    ).values(),
  ].filter((item) => !!item);
  return {
    status,
    pending,
    local,
    review: reviewScope === scope ? review : undefined,
    busy,
    failed,
    territories,
    openReview,
    exportDraft,
    discard,
    close: () => setReview(undefined),
  };
};
export default useTerritorySyncStatus;
