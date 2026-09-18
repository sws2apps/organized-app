import { useAppTranslation } from '@hooks/index';
import { SubmitReportProps } from './index.types';
import useSubmitReport from './useSubmitReport';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';

const SubmitReport = (props: SubmitReportProps) => {
  const { t } = useAppTranslation();

  const { handleSubmitted } = useSubmitReport(props);

  return (
    <Dialog
      onClose={props.onClose}
      open={props.open}
      title={t('tr_markAsSubmitted')}
      description={t('tr_markToBranchOfficeDesc')}
    >
      <DialogActions>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" onClick={handleSubmitted}>
          {t('tr_markAsSubmitted')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubmitReport;
