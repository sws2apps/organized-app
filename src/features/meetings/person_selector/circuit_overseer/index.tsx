import { PersonSelectorType } from '../index.types';
import { IconClose, IconMale } from '@components/icons';
import useCircuitOverseer from './useCircuitOverseer';
import AutoComplete from '@components/autocomplete';

const CircuitOverseer = (props: PersonSelectorType) => {
  const showIcon = props.showIcon;

  const { value, handleValueChange, valueOverride, handleValueSave } =
    useCircuitOverseer(props);

  return (
    <AutoComplete
      readOnly={props.readOnly}
      options={[]}
      label={props.label}
      freeSolo={true}
      clearIcon={valueOverride ? <IconClose height={20} width={20} /> : null}
      inputValue={value}
      onInputChange={(_, value) => handleValueChange(value)}
      onKeyUp={handleValueSave}
      fullWidth={true}
      styleIcon={false}
      startIcon={showIcon ? <IconMale /> : null}
    />
  );
};

export default CircuitOverseer;
