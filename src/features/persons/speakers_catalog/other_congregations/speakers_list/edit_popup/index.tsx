import { Box, IconButton } from '@mui/material';
import { useAtomValue } from 'jotai';
import { IconClose } from '@components/icons';
import { IncomingSpeakerEditPopupType } from './index.types';
import { buildPersonFullname } from '@utils/common';
import { fullnameOptionState } from '@states/settings';
import { useAppTranslation } from '@hooks/index';
import Dialog from '@components/dialog';
import IncomingSpeakerEdit from '../edit';
import Typography from '@components/typography';

const IncomingSpeakerEditPopup = ({
  open,
  onClose,
  speaker,
}: IncomingSpeakerEditPopupType) => {
  const { t } = useAppTranslation();

  const fullnameOption = useAtomValue(fullnameOptionState);

  const name = buildPersonFullname(
    speaker.speaker_data.person_lastname.value,
    speaker.speaker_data.person_firstname.value,
    fullnameOption
  );

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '16px', gap: '16px' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--accent-200)',
          paddingBottom: '8px',
          width: '100%',
        }}
      >
        <Typography className="h2">
          {name.length === 0 ? t('tr_speaker') : name}
        </Typography>
        <IconButton onClick={onClose}>
          <IconClose color="var(--black)" />
        </IconButton>
      </Box>

      <Box sx={{ width: '100%' }}>
        <IncomingSpeakerEdit speaker={speaker} showDelete={false} />
      </Box>
    </Dialog>
  );
};

export default IncomingSpeakerEditPopup;
