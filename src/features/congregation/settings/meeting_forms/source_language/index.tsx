import { useAppTranslation } from '@hooks/index';
import { SourceLanguageProps } from './index.types';
import useCurrentUser from '@hooks/useCurrentUser';
import useSourceLanguage from './useSourceLanguage';
import SourceLanguageSelector from '@components/source_language_selector';

const SourceLanguage = ({ label }: SourceLanguageProps) => {
  const { t } = useAppTranslation();

  const { isMidweekEditor, isWeekendEditor, isPublicTalkCoordinator } =
    useCurrentUser();

  const { value, handleChangeLanguage } = useSourceLanguage();

  return (
    <SourceLanguageSelector
      readOnly={
        !isMidweekEditor && !isWeekendEditor && !isPublicTalkCoordinator
      }
      label={label || t('tr_changeLanguage')}
      value={value}
      onChange={(e) => handleChangeLanguage(String(e.target.value))}
    />
  );
};

export default SourceLanguage;
