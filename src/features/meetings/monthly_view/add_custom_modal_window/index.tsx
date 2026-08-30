import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { AddCustomModalWindowType } from './index.types';
import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';
import Button from '@components/button';
import PartDuration from '@features/meetings/part_duration';
import MeetingPart from '@features/meetings/meeting_part';
import useAddCustomModalWindow from './useAddCustomModalWindow';

const AddCustomModalWindow = (props: AddCustomModalWindowType) => {
  const { t } = useAppTranslation();

  const { handleDeleteCustomLCPart, week, handleAddCustomLCPart } =
    useAddCustomModalWindow(props);

  return (
    <Dialog open={props.open} onClose={null}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography color="var(--black)" className="h2">
            {t('tr_addCustomMeetingPart')}
          </Typography>
        </Box>
        <Typography className="body-regular" color="var(--grey-400)">
          {t('tr_customMeetingPartDesc')}
        </Typography>
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <PartDuration length={15} week={week} type="lc_part3" />
        <MeetingPart
          week={week}
          type="lc_part3"
          color="var(--living-as-christians)"
          isEdit={true}
          isOverwrite={true}
        />
      </Box>
      <DialogActions>
        <Button
          variant="secondary"
          color="red"
          onClick={() => {
            handleDeleteCustomLCPart();
            props.closeFunc();
          }}
        >
          {t('tr_delete')}
        </Button>
        <Button
          variant="main"
          onClick={() => {
            handleAddCustomLCPart();
            props.closeFunc();
          }}
        >
          {t('tr_add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCustomModalWindow;
