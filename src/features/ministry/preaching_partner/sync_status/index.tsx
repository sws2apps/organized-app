import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import InfoNote from '@components/info_note';
import Button from '@components/button';
import Typography from '@components/typography';
import { formatLongDateWithShortVars } from '@utils/date';
import PreachingPartnerConfirmDialog from '@features/ministry/preaching_partner/confirm_dialog';
import usePartnerSyncStatus from '@features/ministry/preaching_partner/sync_status/usePartnerSyncStatus';

const PartnerSyncStatus = () => {
  const { t } = useAppTranslation();
  const {
    cache,
    ready,
    online,
    refreshing,
    refresh,
    discardOpen,
    setDiscardOpen,
    discard,
  } = usePartnerSyncStatus();
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
    >
      {!online && <InfoNote message={t('tr_partnerOffline')} />}
      {!ready && !cache.error && <InfoNote message={t('tr_partnerLoading')} />}
      {cache.pending.length > 0 && (
        <InfoNote
          message={t('tr_partnerPendingChanges', {
            count: cache.pending.length,
          })}
        />
      )}
      {cache.error && <InfoNote message={t(cache.error)} />}
      {cache.pending
        .filter((entry) => entry.error && entry.optimistic.length > 0)
        .map((entry) => (
          <Box
            key={entry.mutation.operationId}
            sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <Typography className="body-small-semibold">
              {t('tr_partnerRejectedDraft', {
                date: formatLongDateWithShortVars(
                  entry.mutation.request.request_data.date
                ),
              })}
            </Typography>
            <Typography
              className="body-small-regular"
              sx={{ overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}
            >
              {entry.mutation.request.request_data.comment}
            </Typography>
          </Box>
        ))}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <Button
          variant="small"
          disabled={!online || refreshing}
          onClick={() => void refresh().catch(() => undefined)}
        >
          {t('tr_partnerRefresh')}
        </Button>
        {cache.pending.some((entry) => entry.error) && (
          <Button variant="small" onClick={() => setDiscardOpen(true)}>
            {t('tr_partnerDiscardFailed')}
          </Button>
        )}
      </Box>
      <PreachingPartnerConfirmDialog
        open={discardOpen}
        onClose={() => setDiscardOpen(false)}
        onConfirm={async () => {
          await discard();
          setDiscardOpen(false);
        }}
        title={t('tr_partnerDiscardFailed')}
        description={t('tr_partnerDiscardFailedDesc')}
        confirmLabel={t('tr_partnerDiscardFailed')}
      />
    </Box>
  );
};
export default PartnerSyncStatus;
