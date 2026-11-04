import { useAppTranslation } from '@hooks/index';
import { useState } from 'react';
import { Button, InfoNote } from '@components/index';
import IconLoading from '@components/icon_loading';
import useExportS13 from '@features/territories/history/useExportS13';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import SwitchWithLabel from '@components/switch_with_label';

const ExportS13Dialog = ({ onClose }: { onClose: VoidFunction }) => {
  const { t } = useAppTranslation();

  const [withCampaigns, setWithCampaigns] = useState(false);
  const { handleExport, isProcessing, failed, retry } =
    useExportS13(withCampaigns);

  return (
    <Dialog
      onClose={onClose}
      open
      title={t('tr_territoryExportS13')}
      description={t('tr_territoryAllRecordedAssignmentsThroughToday')}
    >
      <SwitchWithLabel
        label={t('tr_territoryMarkCampaignAssignments')}
        helper={t('tr_territoryMarkCampaignDatesAllAssignmentsStayIncluded')}
        checked={withCampaigns}
        onChange={setWithCampaigns}
      />

      {failed && (
        <InfoNote
          message={t(
            'tr_territoryTheTerritoryDocumentCouldNotBeGeneratedTryAgain'
          )}
        />
      )}

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button
          variant="main"
          disabled={isProcessing}
          startIcon={
            isProcessing ? <IconLoading width={20} height={20} /> : undefined
          }
          onClick={async () => {
            if (failed) {
              retry();
              return;
            }
            if (await handleExport()) onClose();
          }}
        >
          {t(failed ? 'tr_territoryRetryExport' : 'tr_export')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportS13Dialog;
