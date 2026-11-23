import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  partnerCacheState,
  partnerReadyState,
  partnerSyncState,
  partnerDiscardFailedState,
} from '@states/preaching_partner';
import { isOnlineState } from '@states/app';

const usePartnerSyncStatus = () => {
  const cache = useAtomValue(partnerCacheState);
  const ready = useAtomValue(partnerReadyState);
  const online = useAtomValue(isOnlineState);
  const sync = useSetAtom(partnerSyncState);
  const discard = useSetAtom(partnerDiscardFailedState);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => {
    setRefreshing(true);
    try {
      await sync(true);
    } finally {
      setRefreshing(false);
    }
  };
  return {
    cache,
    ready,
    online,
    refreshing,
    refresh,
    discardOpen,
    setDiscardOpen,
    discard,
  };
};
export default usePartnerSyncStatus;
