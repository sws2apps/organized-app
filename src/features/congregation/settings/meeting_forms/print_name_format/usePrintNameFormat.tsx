import { PrintNameContext } from '@definition/settings';
import useNameFormatOption from '@features/congregation/settings/meeting_forms/name_format_select/useNameFormatOption';
const usePrintNameFormat = (context: PrintNameContext) => {
  const { option: printFullnameOption, handleOptionChange } =
    useNameFormatOption('print_fullname_option', context);
  return {
    printFullnameOption,
    handlePrintFullnameOptionChange: handleOptionChange,
  };
};
export default usePrintNameFormat;
