import { useAppTranslation } from '@hooks/index';
import { MinisitryDetailsProps } from './index.types';
import Badge from '@components/badge';

const MinistryDetails = ({
  hours,
  studies,
  hovered,
}: MinisitryDetailsProps) => {
  const { t } = useAppTranslation();

  return (
    <>
      {studies > 0 && (
        <Badge
          className="body-small-semibold"
          size="big"
          color={hovered ? 'accent' : 'grey'}
          sx={{ borderRadius: 'var(--radius-s)' }}
          text={t('tr_bibleStudiesCount', {
            StudiesCount: studies,
          })}
        />
      )}

      {hours.length > 0 && (
        <Badge
          className="body-small-semibold"
          size="big"
          color={hovered ? 'accent' : 'grey'}
          sx={{ borderRadius: 'var(--radius-s)' }}
          text={t('tr_hoursList', {
            Hours: hours,
          })}
        />
      )}
    </>
  );
};

export default MinistryDetails;
