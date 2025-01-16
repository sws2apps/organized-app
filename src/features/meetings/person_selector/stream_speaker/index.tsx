import { PersonSelectorType } from '../index.types';
import { IconClose, IconMale } from '@components/icons';
import useStreamSpeaker from './useStreamSpeaker';
import AutoComplete from '@components/autocomplete';

const StreamSpeaker = (props: PersonSelectorType) => {
  const showIcon = props.showIcon;

  const { value, handleValueChange, handleValueSave } = useStreamSpeaker(props);

  return (
    <AutoComplete
      readOnly={props.readOnly}
      options={[]}
      label={props.label}
      freeSolo={true}
      clearIcon={<IconClose height={20} width={20} />}
      inputValue={value}
      onInputChange={(_, value) => handleValueChange(value)}
      onKeyUp={handleValueSave}
      fullWidth={true}
      styleIcon={false}
      startIcon={showIcon ? <IconMale /> : null}
    />
  );
};

export default StreamSpeaker;
