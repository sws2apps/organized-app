import { useAppTranslation } from '@hooks/index';
import useDisplayName from './useDisplayName';
import SwitchWithLabel from '@components/switch_with_label';

const DisplayName = () => {
  const { t } = useAppTranslation();

  const { displayNameMeeting, handleDisplayNameMeetingToggle } =
    useDisplayName();

  return (
    <SwitchWithLabel
      label={t('tr_useDisplayNameMeeting')}
      checked={displayNameMeeting}
      onChange={handleDisplayNameMeetingToggle}
    />
  );
};

export default DisplayName;
