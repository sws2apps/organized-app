import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';

const OutgoingSpeakersListInactive = () => {
  const { t } = useAppTranslation();

  return (
    <Typography color="var(--grey-400)">
      {t('tr_outgoingSpeakersAccessNoneDesc')}
    </Typography>
  );
};

export default OutgoingSpeakersListInactive;
