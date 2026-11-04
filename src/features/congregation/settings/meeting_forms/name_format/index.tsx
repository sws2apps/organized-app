import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useNameFormat from './useNameFormat';
import NameFormatSelect from '../name_format_select';

const NameFormat = () => {
  const { t } = useAppTranslation();

  const { isMidweekEditor, isWeekendEditor, isPublicTalkCoordinator } =
    useCurrentUser();

  const { fullnameOption, handleFullnameOptionChange } = useNameFormat();

  return (
    <NameFormatSelect
      label={t('tr_nameFormat')}
      value={fullnameOption}
      onChange={handleFullnameOptionChange}
      readOnly={
        !isMidweekEditor && !isWeekendEditor && !isPublicTalkCoordinator
      }
    />
  );
};

export default NameFormat;
