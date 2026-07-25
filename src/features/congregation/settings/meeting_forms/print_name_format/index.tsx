import { useAppTranslation, useCurrentUser } from '@hooks/index';
import usePrintNameFormat from './usePrintNameFormat';
import NameFormatSelect from '../name_format_select';

const PrintNameFormat = () => {
  const { t } = useAppTranslation();

  const { isMidweekEditor, isWeekendEditor, isPublicTalkCoordinator } =
    useCurrentUser();

  const { printFullnameOption, handlePrintFullnameOptionChange } =
    usePrintNameFormat();

  return (
    <NameFormatSelect
      label={t('tr_printNameFormat')}
      value={printFullnameOption}
      onChange={handlePrintFullnameOptionChange}
      readOnly={
        !isMidweekEditor && !isWeekendEditor && !isPublicTalkCoordinator
      }
    />
  );
};

export default PrintNameFormat;
