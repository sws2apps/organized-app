import { Box, IconButton } from '@mui/material';
import { IconClose } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { AssignmentsHistoryDialogType } from './index.types';
import AssignmentsHistory from '../assignments_history';
import Dialog from '@components/dialog';
import Typography from '@components/typography';

const AssignmentsHistoryDialog = ({
  open,
  onClose,
  person,
  history,
}: AssignmentsHistoryDialogType) => {
  const { t } = useAppTranslation();

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Box
        sx={{
          display: 'flex',
          gap: '4px',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Typography className="h3">{t('tr_assignmentsHistory')}</Typography>
          <Typography color="var(--grey-400)">{person}</Typography>
        </Box>

        <IconButton sx={{ padding: 0 }} onClick={onClose}>
          <IconClose color="var(--grey-400)" />
        </IconButton>
      </Box>

      <AssignmentsHistory history={history} />
    </Dialog>
  );
};

export default AssignmentsHistoryDialog;
