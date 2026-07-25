import { useAtomValue } from 'jotai';
import { printFullnameOptionState } from '@states/settings';
import useNameFormatOption from '../name_format_select/useNameFormatOption';

const usePrintNameFormat = () => {
  const optionInitial = useAtomValue(printFullnameOptionState);

  const { option: printFullnameOption, handleOptionChange } =
    useNameFormatOption('print_fullname_option', optionInitial);

  return {
    printFullnameOption,
    handlePrintFullnameOptionChange: handleOptionChange,
  };
};

export default usePrintNameFormat;
