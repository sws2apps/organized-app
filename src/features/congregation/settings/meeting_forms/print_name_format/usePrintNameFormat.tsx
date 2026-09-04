import { useAtomValue } from 'jotai';
import { printFullnameOptionState } from '@states/settings';
import { FullnameOption } from '@definition/settings';
import { NAME_FORMAT_INHERIT } from '../name_format_select/index.types';
import useNameFormatOption from '../name_format_select/useNameFormatOption';

const usePrintNameFormat = () => {
  const optionInitial = useAtomValue(printFullnameOptionState);

  const { option, hasRecord, handleOptionChange, handleOptionClear } =
    useNameFormatOption('print_fullname_option', optionInitial);

  // while no explicit choice is stored, the select shows the inherit entry
  const printFullnameOption = hasRecord ? option : NAME_FORMAT_INHERIT;

  const handlePrintFullnameOptionChange = async (value: FullnameOption) => {
    if (value === NAME_FORMAT_INHERIT) {
      await handleOptionClear();
      return;
    }

    await handleOptionChange(value);
  };

  return {
    printFullnameOption,
    handlePrintFullnameOptionChange,
  };
};

export default usePrintNameFormat;
