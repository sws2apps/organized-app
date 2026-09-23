import { useState } from 'react';
import { Button, TextField } from '@components/index';
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
    <Dialog
      onClose={onClose}
      open
      title="Add text"
      description="The note is printed on the territory card together with the map."
    >
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
