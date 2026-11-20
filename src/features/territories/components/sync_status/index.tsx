import { Box, Stack } from '@mui/material';
import { Button, InfoNote, Typography } from '@components/index';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { useAppTranslation } from '@hooks/index';
import { synchronizeTerritories } from '@services/app/territory_sync';
import useTerritorySyncStatus from './useTerritorySyncStatus';

const TerritorySyncStatus = () => {
  const { t } = useAppTranslation();
  const state = useTerritorySyncStatus();
  const { status, pending, local } = state;
  if (local || (status === 'idle' && !pending)) return null;
  const keys = {
    idle: 'tr_territorySyncPending',
    pending: 'tr_territorySyncPending',
    syncing: 'tr_territorySyncing',
    conflict: 'tr_territorySyncConflict',
    identity: 'tr_territorySyncIdentity',
    unavailable: 'tr_territorySyncUnavailable',
    failed: 'tr_territorySyncFailed',
  };
  return (
    <>
      <Box role="status" aria-live="polite">
        <InfoNote message={t(keys[status])} />
        {status !== 'syncing' && (
          <Stack direction="row">
            <Button
              variant="small"
              onClick={() => {
                void synchronizeTerritories();
              }}
            >
              {t('tr_territorySyncRetry')}
            </Button>
            {!!pending && (
              <Button
                variant="small"
                onClick={() => {
                  void state.openReview();
                }}
              >
                {t('tr_territorySyncReview')}
              </Button>
            )}
          </Stack>
        )}
        {state.failed && !state.review && (
          <InfoNote message={t('tr_territorySyncFailed')} />
        )}
      </Box>
      {state.review && (
        <Dialog
          open
          onClose={state.busy ? () => {} : state.close}
          title={t('tr_territorySyncReview')}
          description={t('tr_territorySyncReviewDescription')}
        >
          {state.review.settings && (
            <InfoNote message={t('tr_territorySyncSettingsPending')} />
          )}
          {state.territories.map((territory) => (
            <Typography key={territory.id}>
              {territory.number} — {territory.name}
            </Typography>
          ))}
          {state.failed && (
            <Box role="alert">
              <InfoNote message={t('tr_territorySyncFailed')} />
            </Box>
          )}
          <DialogActions>
            <Button
              variant="secondary"
              disabled={state.busy}
              onClick={() => {
                void state.exportDraft();
              }}
            >
              {t('tr_territorySyncExportDraft')}
            </Button>
            <Button
              variant="secondary"
              disabled={state.busy}
              onClick={state.close}
            >
              {t('tr_cancel')}
            </Button>
            <Button
              variant="main"
              disabled={state.busy}
              onClick={() => {
                void state.discard();
              }}
            >
              {t('tr_territorySyncUseServer')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
export default TerritorySyncStatus;
