import { useAppTranslation } from '@hooks/index';
import { MinisitryDetailsProps } from './index.types';
import Badge from '@components/badge';

const MinistryDetails = ({
  studies,
  hovered,
  hours_credit,
  hours_field,
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

      {hours_field.length > 0 && (
        <Badge
          className="body-small-semibold"
          size="big"
          color={hovered ? 'accent' : 'grey'}
          sx={{ borderRadius: 'var(--radius-s)' }}
          text={t('tr_hoursList', { Hours: hours_field })}
        />
      )}

      {hours_credit.length > 0 && (
        <Badge
          className="body-small-semibold"
          size="big"
          color={hovered ? 'accent' : 'grey'}
          sx={{ borderRadius: 'var(--radius-s)' }}
          text={t('tr_creditValue', { value: hours_credit })}
        />
      )}
    </>
  );
};

export default MinistryDetails;
