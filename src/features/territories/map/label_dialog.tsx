import { useState } from 'react';
import { Stack } from '@mui/material';
import { Button, TextField, Typography } from '@components/index';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';

const LabelDialog = ({
  onSave,
  onClose,
}: {
  onSave: (text: string) => void;
  onClose: VoidFunction;
}) => {
  const [text, setText] = useState('');

  return (
    <Dialog onClose={onClose} open sx={{ padding: '24px' }}>
      <Stack spacing="4px" sx={{ width: '100%' }}>
        <Typography className="h3">Add text</Typography>
        <Typography className="body-small-regular" color="var(--grey-400)">
          The note is printed on the territory card together with the map.
        </Typography>
      </Stack>

      <TextField
        label="Text"
        autoFocus
        value={text}
        onChange={(event) => setText(event.target.value)}
      />

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="main"
          disabled={!text.trim()}
          onClick={() => onSave(text)}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LabelDialog;
