import { Box } from '@mui/material';
import useBibleStudiesEditor from './useBibleStudiesEditor';
import MinusButton from '@components/minus_button';
import PlusButton from '@components/plus_button';
import TextField from '@components/textfield';

const BibleStudiesEditor = () => {
  const { handleDecrement, handleIncrement, handleValueChange, value } =
    useBibleStudiesEditor();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '180px',
      }}
    >
      <MinusButton onClick={handleDecrement} sx={{ padding: '7px' }} />
      <TextField
        value={value}
        onChange={(e) => handleValueChange(e.target.value)}
        inputProps={{
          className: 'h2',
          style: { color: value === 0 ? 'var(--accent-350)' : 'var(--black)' },
        }}
        sx={{
          '.MuiInputBase-input': {
            textAlign: 'center',
          },
          '.MuiOutlinedInput-root': {
            paddingRight: 'unset !important',
          },
          '& fieldset': {
            border: 'none',
          },
        }}
      />
      <PlusButton onClick={handleIncrement} sx={{ padding: '7px' }} />
    </Box>
  );
};

export default BibleStudiesEditor;
