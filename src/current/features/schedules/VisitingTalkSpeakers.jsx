import { useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import IconButton from '@mui/material/IconButton';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { PublicTalkNumber } from '../publicTalks';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { Schedules } from '../../classes/Schedules';
import { refreshScreenState } from '../../states/main';

const VisitingTalkSpeakers = ({ talk, weekOf, handleClose, speaker }) => {
  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setRefreshScreen = useSetRecoilState(refreshScreenState);

  const getTitle = () => {
    let title = talk.talk_title;
    if (talk.last_delivered_formatted !== '') title += ` (${talk.last_delivered_formatted})`;

    return title;
  };

  const getContactInfo = (speaker) => {
    let contact = '';
    if (speaker.email !== '') contact += speaker.email;
    if (speaker.phone !== '') {
      if (contact !== '') contact += ' / ';
      contact += speaker.phone;
    }

    return contact;
  };

  const handleSetVisitingSpeaker = async (speaker) => {
    try {
      const schedule = Schedules.get(weekOf);
      await schedule.savePublicTalk(talk.talk_number);
      await schedule.saveAssignment(speaker.person_uid, 'speaker_1');
      setRefreshScreen((prev) => !prev);
      handleClose();
    } catch (err) {
      setAppMessage(err.message);
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  };

  const handleRemoveVisitingSpeaker = async () => {
    try {
      const schedule = Schedules.get(weekOf);
      await schedule.saveAssignment(undefined, 'speaker_1');
      setRefreshScreen((prev) => !prev);
      handleClose();
    } catch (err) {
      setAppMessage(err.message);
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
      <PublicTalkNumber talk_number={talk.talk_number} />
      <Box sx={{ width: '100%' }}>
        <TextField fullWidth variant="outlined" size="small" InputProps={{ readOnly: true }} value={getTitle()} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px' }}>
          {talk.incoming_speakers.map((incomingSpeaker) => (
            <Box
              key={`incoming-speaker-${incomingSpeaker.person_uid}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                justifyContent: 'space-between',
                maxWidth: '500px',
                border: '1px outset',
                padding: '5px 10px',
                borderRadius: '5px',
              }}
            >
              <Box>
                <Typography sx={{ marginRight: '10px', fontWeight: 'bold' }}>{incomingSpeaker.person_name}</Typography>
                <Typography sx={{ fontSize: '13px', marginBottom: '5px' }}>
                  {getContactInfo(incomingSpeaker)}
                </Typography>
                <Typography
                  sx={{ fontSize: '13px' }}
                >{`${incomingSpeaker.cong_name} (${incomingSpeaker.cong_number})`}</Typography>
              </Box>
              {incomingSpeaker.person_uid !== speaker && (
                <IconButton color="success" onClick={() => handleSetVisitingSpeaker(incomingSpeaker)}>
                  <HowToRegIcon />
                </IconButton>
              )}

              {incomingSpeaker.person_uid === speaker && (
                <IconButton color="error" onClick={handleRemoveVisitingSpeaker}>
                  <PersonRemoveIcon />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default VisitingTalkSpeakers;
