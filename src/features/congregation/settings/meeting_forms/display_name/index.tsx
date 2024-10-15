import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useDisplayName from './useDisplayName';
import SwitchWithLabel from '@components/switch_with_label';

const DisplayName = () => {
  const { t } = useAppTranslation();

  const { isMidweekEditor, isWeekendEditor, isPublicTalkCoordinator } =
    useCurrentUser();

  const { displayNameMeeting, handleDisplayNameMeetingToggle } =
    useDisplayName();

  return (
    <SwitchWithLabel
      label={t('tr_useDisplayNameMeeting')}
      checked={displayNameMeeting}
      onChange={handleDisplayNameMeetingToggle}
      readOnly={
        !isMidweekEditor && !isWeekendEditor && !isPublicTalkCoordinator
      }
    />
  );
};

export default DisplayName;
