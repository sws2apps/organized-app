import { useAppTranslation } from '@hooks/index';
import IBAnnouncementCard from '../../announcement_card';
import { Stack } from '@mui/material';
import useSWAuxiliaryPioneers from './useAuxiliaryPioneers';

const SWAuxiliaryPioneer = () => {
  const { t } = useAppTranslation();
  const { filteredAuxiliaryPioneers, auxiliaryPioneers, lastUpdated } =
    useSWAuxiliaryPioneers();
  return (
    filteredAuxiliaryPioneers.length !== 0 && (
      <IBAnnouncementCard
        title={t('tr_APs')}
        pinned={false}
        date={lastUpdated}
        counter={filteredAuxiliaryPioneers.length}
        content={<Stack spacing={'8px'}>{auxiliaryPioneers}</Stack>}
      />
    )
  );
};
export default SWAuxiliaryPioneer;
