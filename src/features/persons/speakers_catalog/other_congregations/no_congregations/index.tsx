
import { useAppTranslation } from '@hooks/index';
import InfoNote from '@components/info_note';

const NoCongregations = () => {
  const { t } = useAppTranslation();

  return <InfoNote variant="card" message={t('tr_noCongregationsYetInfo')} />;
};

export default NoCongregations;
