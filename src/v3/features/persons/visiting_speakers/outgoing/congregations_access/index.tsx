import { CongregationAccessType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useCongregationsAccess from './useCongregationsAccess';
import Button from '@components/button';
import Dialog from '@components/dialog';
import OutgoingSpeakersListActive from './active';
import OutgoingSpeakersListInactive from './inactive';
import Typography from '@components/typography';
import WaitingCircular from '@components/waiting_circular';

const OutgoingSpeakersAccess = ({ open, onClose }: CongregationAccessType) => {
  const { t } = useAppTranslation();

  const { congregations } = useCongregationsAccess();

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Typography className="h2">{t('tr_outgoingSpeakersAccess')}</Typography>

      <WaitingCircular variant="standard" />

      {congregations.length === 0 && <OutgoingSpeakersListInactive />}

      <OutgoingSpeakersListActive />

      <Button variant="main" onClick={onClose} sx={{ width: '100%' }}>
        OK
      </Button>
    </Dialog>
  );
};

export default OutgoingSpeakersAccess;
