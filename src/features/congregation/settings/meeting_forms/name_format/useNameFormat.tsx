import { useAtomValue } from 'jotai';
import { fullnameOptionState } from '@states/settings';
import useNameFormatOption from '../name_format_select/useNameFormatOption';

const useNameFormat = () => {
  const optionInitial = useAtomValue(fullnameOptionState);

  const { option: fullnameOption, handleOptionChange } = useNameFormatOption(
    'fullname_option',
    optionInitial
  );

  return {
    fullnameOption,
    handleFullnameOptionChange: handleOptionChange,
  };
};

export default useNameFormat;
