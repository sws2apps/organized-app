import { Box } from '@mui/material';
import { TextFieldStandardProps } from './index.types';
import { TextFieldStandard } from './index.styles';
import useStandardEditor from './useStandardEditor';
import MinusButton from '@components/minus_button';
import PlusButton from '@components/plus_button';
import Typography from '@components/typography';

const StandardEditor = (props: TextFieldStandardProps) => {
  const { handleDecrement, handleIncrement, handleValueChange, inputValue } =
    useStandardEditor(props);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: props.readOnly ? 'unset' : '180px',
        minWidth: props.readOnly ? 'unset' : '180px',
      }}
    >
      {props.readOnly && (
        <Typography
          className={props.className || 'h3'}
          color={inputValue === 0 ? 'var(--accent-350)' : 'var(--black)'}
        >
          {inputValue}
        </Typography>
      )}

      {!props.readOnly && (
        <>
          <MinusButton onClick={handleDecrement} sx={{ padding: '7px' }} />

          <TextFieldStandard
            type="number"
            value={inputValue}
            onChange={handleValueChange}
            slotProps={{
              htmlInput: {
                className: props.className || 'h2',
                inputMode: 'numeric',
                pattern: '[0-9]*',
                style: {
                  color:
                    inputValue === 0 ? 'var(--accent-350)' : 'var(--black)',
                },
              },
            }}
          />

          <PlusButton onClick={handleIncrement} sx={{ padding: '7px' }} />
        </>
      )}
    </Box>
  );
};

export default StandardEditor;
