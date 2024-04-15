import { useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import PlaylistAddCircleIcon from '@mui/icons-material/PlaylistAddCircle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { S34s } from '../../classes/S34s';
import { publicTalksState } from '../../states/sourceMaterial';
import { Schedules } from '../../classes/Schedules';
import PublicTalkHistory from './PublicTalkHistory';
import PublicTalkNumber from './PublicTalkNumber';
import { Setting } from '../../classes/Setting';

const PublicTalkEditor = ({ public_talk, readOnly, setPublicTalk }) => {
  const setPublicTalks = useSetRecoilState(publicTalksState);

  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState('');

  const publicTalkCoordinatorRole = Setting.cong_role.includes('public_talk_coordinator');

  const history = Schedules.talkHistory.find((record) => record.talk_number === public_talk.talk_number);

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleCancel = () => {
    setIsEdit(false);
    setTitle(public_talk.talk_title || '');
  };

  const handleSave = async () => {
    const S34 = S34s.get(public_talk.talk_number);
    await S34.save(title);

    setPublicTalks(S34s.getLocal());

    setIsEdit(false);
  };

  useEffect(() => {
    let title = public_talk.talk_title;
    if (readOnly && history.last_delivered_formatted !== '') title += ` (${history.last_delivered_formatted})`;
    setTitle(title);
  }, [public_talk, history, readOnly]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
        <PublicTalkNumber talk_number={public_talk.talk_number} />
        <Box sx={{ width: '100%' }}>
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{ readOnly: !publicTalkCoordinatorRole || (publicTalkCoordinatorRole && !isEdit) }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <PublicTalkHistory talk_number={public_talk.talk_number} />

          {publicTalkCoordinatorRole && !readOnly && public_talk.talk_modified !== '' && (
            <Typography
              align="right"
              sx={{ fontSize: '14px', marginTop: '8px', fontStyle: 'italic', marginRight: '10px' }}
            >
              {new Date(public_talk.talk_modified).toLocaleString()}
            </Typography>
          )}
        </Box>

        {publicTalkCoordinatorRole && !isEdit && !readOnly && (
          <IconButton aria-label="edit" color="info" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
        )}
        {publicTalkCoordinatorRole && isEdit && (
          <IconButton aria-label="save" color="error" onClick={handleCancel}>
            <ClearIcon />
          </IconButton>
        )}
        {publicTalkCoordinatorRole && isEdit && (
          <IconButton aria-label="save" color="success" onClick={handleSave}>
            <CheckIcon />
          </IconButton>
        )}

        {publicTalkCoordinatorRole && readOnly && (
          <IconButton aria-label="save" color="success" onClick={() => setPublicTalk(public_talk.talk_number)}>
            <PlaylistAddCircleIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default PublicTalkEditor;
