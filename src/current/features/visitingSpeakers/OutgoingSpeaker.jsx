import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import SpeakerTalk from './SpeakerTalk';
import { VisitingSpeakers } from '../../classes/VisitingSpeakers';
import { refreshScreenState } from '../../states/main';

const OutgoingSpeaker = ({ speaker }) => {
  const { t } = useTranslation('ui');

  const setScreenRefresh = useSetRecoilState(refreshScreenState);

  const handleDeleteVisitingSpeaker = async () => {
    await VisitingSpeakers.deleteSpeaker({
      person_uid: speaker.person_uid,
      cong_number: speaker.cong_number,
    });
    setScreenRefresh((prev) => !prev);
  };

  return (
    <Box
      sx={{
        borderBottom: '2px outset',
        padding: '20px 0 15px 0',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '15px',
        flexWrap: 'wrap',
        width: '100%',
      }}
    >
      <TextField
        label={t('name')}
        variant="outlined"
        size="small"
        fullWidth
        sx={{ maxWidth: '320px' }}
        value={speaker.person_name}
        InputProps={{
          readOnly: true,
        }}
      />
      <Box sx={{ display: 'flex', flexWrap: 'nowrap', flexGrow: 1, minWidth: '300px', gap: '10px' }}>
        <SpeakerTalk speaker={speaker} />
        <IconButton color="error" onClick={handleDeleteVisitingSpeaker}>
          <DeleteIcon sx={{ fontSize: '25px' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default OutgoingSpeaker;
