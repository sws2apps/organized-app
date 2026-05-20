import { IconLanguageGroup } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { LanguageGroupProps } from './index.types';
import useLanguageGroup from './useLanguageGroup';
import SettingsTab from '@components/settings_tab';

const LanguageGroup = (props: LanguageGroupProps) => {
  const { t } = useAppTranslation();

  const { group_name, count, language } = useLanguageGroup(props);

  return (
    <SettingsTab
      renderIcon={(color) => <IconLanguageGroup color={color} />}
      label={group_name}
      description={`${language ? language + '. ' : ''}${t('tr_personsAmount', { amount: count })}`}
      active={props.active}
      onClick={props.onClick}
      mini={props.mini}
    />
  );
};

export default LanguageGroup;
