import { Box } from '@mui/material';
import { BibleStudiesEditorProps } from './index.types';
import { TextFieldBibleStudies } from './index.styles';
import useBibleStudiesEditor from './useBibleStudiesEditor';
import MinusButton from '@components/minus_button';
import PlusButton from '@components/plus_button';

const BibleStudiesEditor = (props: BibleStudiesEditorProps) => {
  const { handleDecrement, handleIncrement, handleValueChange, inputValue } =
    useBibleStudiesEditor(props);

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
      <TextFieldBibleStudies
        type="number"
        value={inputValue}
        onChange={handleValueChange}
        inputProps={{
          className: 'h2',
          style: {
            color: inputValue === 0 ? 'var(--accent-350)' : 'var(--black)',
          },
        }}
      />

      <PlusButton onClick={handleIncrement} sx={{ padding: '7px' }} />
    </Box>
  );
};

export default BibleStudiesEditor;
