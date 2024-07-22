import {
  Checkbox,
  InputLabel,
  ListItemText,
  OutlinedInput,
} from '@mui/material';
import { MultiSelectPropsType } from './types';
import { StyledMultiSelect, StyledFormControl, StyledMenuItem } from './styled';

/**
 * Custom Multi Select Component.
 *
 * @param props The props for the MultiSelect Component.
 * @returns A custom select input field.
 */
const MultiSelect = (props: MultiSelectPropsType) => {
  const {
    label = 'Label',
    value,
    onChange,
    required = false,
    height = 44,
    fullWidth = true,
    options = [],
    disabled = false,
  } = props;
  const varHeight = (56 - height) / 2;

  return (
    <StyledFormControl varHeight={varHeight} fullWidth>
      <InputLabel id="demo-multiple-checkbox-label">{label}</InputLabel>
      <StyledMultiSelect
        className="small-card-shadow"
        id="demo-multiple-checkbox"
        labelId="demo-multiple-checkbox-label"
        label={label}
        input={<OutlinedInput label={label} />}
        multiple
        value={value}
        onChange={onChange}
        renderValue={(selected: string[]) => selected.join(', ')}
        fullWidth={fullWidth}
        variant="outlined"
        required={required}
        height={height}
        varHeight={varHeight}
        sx={props.sx}
        inputProps={{
          disabled,
        }}
      >
        {options.map((name) => (
          <StyledMenuItem key={name} value={name}>
            <Checkbox checked={(props.value as string[]).indexOf(name) > -1} />
            <ListItemText primary={name} />
          </StyledMenuItem>
        ))}
      </StyledMultiSelect>
    </StyledFormControl>
  );
};

export default MultiSelect;
