import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useSongsWeekend from './useSongsWeekend';
import SwitchWithLabel from '@components/switch_with_label';

const SongsWeekend = () => {
  const { t } = useAppTranslation();

  const { isWeekendEditor, isPublicTalkCoordinator } = useCurrentUser();

  const { showSong, handleShowSongToggle } = useSongsWeekend();

  return (
    <SwitchWithLabel
      label={t('tr_weekendTemplateShowSongs')}
      checked={showSong}
      onChange={handleShowSongToggle}
      readOnly={!isWeekendEditor && !isPublicTalkCoordinator}
    />
  );
};

export default SongsWeekend;
