import { Box } from '@mui/material';
import { HoursEditorProps } from './index.types';
import useHoursEditor from './useHoursEditor';
import MinusButton from '@components/minus_button';
import PlusButton from '@components/plus_button';
import TimeField from '@components/timefield';

const HoursEditor = (props: HoursEditorProps) => {
  const { handleDecrement, handleIncrement, handleValueChange, inputValue } =
    useHoursEditor(props);

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
      <TimeField
        className="h2"
        value={inputValue}
        onChange={handleValueChange}
      />
      <PlusButton onClick={handleIncrement} sx={{ padding: '7px' }} />
    </Box>
  );
};

export default HoursEditor;
