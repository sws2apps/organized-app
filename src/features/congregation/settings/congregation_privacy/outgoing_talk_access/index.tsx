import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useCongregationPrivacy from './useOutgoingTalkAccess';
import SwitchWithLabel from '@components/switch_with_label';

const OutgoingTalkAccess = () => {
  const { t } = useAppTranslation();

  const { isPublicTalkCoordinator } = useCurrentUser();

  const { outgoingTalksPublic, handleOutgoingTalksPublicToggle } =
    useCongregationPrivacy();

  return (
    <SwitchWithLabel
      label={t('tr_showOutgoingToAll')}
      helper={t('tr_showOutgoingToAllDesc')}
      checked={outgoingTalksPublic}
      onChange={handleOutgoingTalksPublicToggle}
      readOnly={!isPublicTalkCoordinator}
    />
  );
};

export default OutgoingTalkAccess;
