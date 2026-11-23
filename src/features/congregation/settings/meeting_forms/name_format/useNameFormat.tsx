import useNameFormatOption from '@features/congregation/settings/meeting_forms/name_format_select/useNameFormatOption';
const useNameFormat = () => {
  const { option: fullnameOption, handleOptionChange } =
    useNameFormatOption('fullname_option');
  return { fullnameOption, handleFullnameOptionChange: handleOptionChange };
};
export default useNameFormat;
