import { PrintNameContext } from '@definition/settings';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import usePrintNameFormat from './usePrintNameFormat';
import NameFormatSelect from '../name_format_select';

const PrintNameFormat = ({
  context,
  label,
}: {
  context: PrintNameContext;
  label: string;
}) => {
  const { t } = useAppTranslation();

  const { isMidweekEditor, isWeekendEditor, isPublicTalkCoordinator } =
    useCurrentUser();

  const { printFullnameOption, handlePrintFullnameOptionChange } =
    usePrintNameFormat(context);

  return (
    <NameFormatSelect
      label={t(label)}
      value={printFullnameOption}
      onChange={handlePrintFullnameOptionChange}
      readOnly={
        !isMidweekEditor && !isWeekendEditor && !isPublicTalkCoordinator
      }
      inherit
    />
  );
};

export default PrintNameFormat;
