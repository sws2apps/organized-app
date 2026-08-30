import { useAppTranslation } from '@hooks/index';
import InfoNote from '@components/info_note';

const NoSpeakers = () => {
  const { t } = useAppTranslation();

  return <InfoNote message={t('tr_noSpeakersYet')} />;
};

export default NoSpeakers;
