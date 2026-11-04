import { useAppTranslation } from '@hooks/index';
import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { Stack } from '@mui/material';
import { Button, Typography } from '@components/index';
import {
  congregationBoundaryState,
  territoriesState,
} from '@states/territories';
import {
  offlineMapState,
  mapDownloads,
  OfflineRegion,
} from '@services/maps/offline';
import { tileUrls } from '@services/maps/tiles';
import { shortDateFormatState } from '@states/settings';
import { formatDate } from '@utils/date';
import { boundaryBounds } from '@features/territories/map/helpers';

const OfflineSettings = ({ provider }: { provider: string }) => {
  const { t } = useAppTranslation();

  const state = useAtomValue(offlineMapState);
  const dateFormat = useAtomValue(shortDateFormatState);
  const boundary = useAtomValue(congregationBoundaryState);
  const territories = useAtomValue(territoriesState);
  const [error, setError] = useState('');
  const area = useMemo(
    () =>
      boundary?.length
        ? boundary
        : territories.flatMap((item) => item.boundary ?? []),
    [boundary, territories]
  );
  const estimate = useMemo(() => {
    if (!area.length) return null;
    try {
      return Math.ceil(
        tileUrls('{z}/{x}/{y}', boundaryBounds(area) as OfflineRegion['bounds'])
          .length *
          0.08 +
          40
      );
    } catch {
      return null;
    }
  }, [area]);
  if (!state.available) return null;
  const download = () => {
    if (!area.length) return;
    setError('');
    void mapDownloads()?.download(
      boundaryBounds(area) as OfflineRegion['bounds'],
      provider
    );
  };
  // the action sits beside the text it belongs to; what follows from it goes below
  const action = state.busy ? (
    <Button variant="secondary" onClick={() => mapDownloads()?.cancel()}>
      {t('tr_cancel')}
    </Button>
  ) : (
    <Button variant="secondary" disabled={!area.length} onClick={download}>
      {state.region ? t('tr_update') : t('tr_download')}
    </Button>
  );

  return (
    <Stack spacing="8px">
      <Stack direction="row" sx={{ alignItems: 'center', gap: '16px' }}>
        <Stack spacing="4px" sx={{ flex: 1, minWidth: 0 }}>
          <Typography className="h4">{t('tr_territoryOfflineMap')}</Typography>
          <Typography className="body-small-regular" color="var(--grey-400)">
            {t('tr_territoryDownloadStreetsAndBothMapThemesForOfflineUse')}
          </Typography>
        </Stack>
        <Stack sx={{ flexShrink: 0 }}>{action}</Stack>
      </Stack>
      {estimate !== null && !state.region && (
        <Typography className="label-small-regular" color="var(--grey-400)">
          {t('tr_territoryEstimatedDownloadMBActualSizeDependsOnMapDetail', {
            size: estimate,
          })}
        </Typography>
      )}
      {state.region && (
        <Typography className="body-small-regular">
          {t('tr_territoryDownloadedMB', {
            date: formatDate(new Date(state.region.date), dateFormat),
            size: (state.region.bytes / 1024 / 1024).toFixed(1),
          })}
        </Typography>
      )}
      {state.busy && (
        <Typography role="status" className="body-small-regular">
          {t('tr_territoryDownloadingMap', {
            done: state.done,
            total: state.total || '…',
          })}
        </Typography>
      )}
      {(error || state.error) && (
        <Typography role="alert" color="var(--red-main)">
          {t(error || state.error!, {
            defaultValue: t(
              'tr_territoryTheOfflineMapCouldNotBeUpdatedTryAgain'
            ),
          })}
        </Typography>
      )}
      {!state.busy && !area.length && (
        <Typography className="body-small-regular" color="var(--grey-400)">
          {t('tr_territoryDrawATerritoryOrCongregationBoundaryFirst')}
        </Typography>
      )}
      {!state.busy && state.region && (
        <Button
          variant="tertiary"
          sx={{ alignSelf: 'flex-start' }}
          onClick={() =>
            void mapDownloads()
              ?.remove()
              .catch((error) => setError((error as Error).message))
          }
        >
          {t('tr_territoryRemoveDownload')}
        </Button>
      )}
    </Stack>
  );
};
export default OfflineSettings;
