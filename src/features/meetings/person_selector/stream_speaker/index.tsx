import { PersonSelectorType } from '../index.types';
import { IconClose, IconMale } from '@components/icons';
import useStreamSpeaker from './useStreamSpeaker';
import AutoComplete from '@components/autocomplete';

const StreamSpeaker = (props: PersonSelectorType) => {
  const { value, handleValueChange, handleValueSave } = useStreamSpeaker(props);

  return (
    <AutoComplete
      options={[]}
      label={props.label}
      freeSolo={true}
      clearIcon={<IconClose height={20} width={20} />}
      inputValue={value}
      onInputChange={(_, value) => handleValueChange(value)}
      onKeyUp={handleValueSave}
      fullWidth={true}
      styleIcon={false}
      startIcon={!props.notShowIcon && <IconMale />}
    />
  );
};

export default StreamSpeaker;
