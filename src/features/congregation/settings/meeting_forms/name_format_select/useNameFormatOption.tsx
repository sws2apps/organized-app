import { useAtomValue, useSetAtom } from 'jotai';
import {
  fullnameOptionState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { nameFormatChangeState } from '@states/name_settings';
import { NameFormatSelection, PrintNameContext } from '@definition/settings';
import { getPrintNameSelection } from '@utils/name_format';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';

const useNameFormatOption = (
  field: 'fullname_option' | 'print_fullname_option',
  context: PrintNameContext = 'schedule'
) => {
  const settings = useAtomValue(settingsState);
  const view = useAtomValue(userDataViewState);
  const appOption = useAtomValue(fullnameOptionState);
  const save = useSetAtom(nameFormatChangeState);
  const option =
    field === 'fullname_option'
      ? appOption
      : getPrintNameSelection(
          settings.cong_settings.print_fullname_option,
          view,
          context
        );
  const handleOptionChange = async (selection: NameFormatSelection) => {
    try {
      await save({ field, view, context, selection });
    } catch {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode('error_app_name-save'),
        severity: 'error',
      });
    }
  };
  return { option, handleOptionChange };
};
export default useNameFormatOption;
