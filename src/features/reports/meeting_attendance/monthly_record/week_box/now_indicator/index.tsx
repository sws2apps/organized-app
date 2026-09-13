import { useAppTranslation } from '@hooks/index';
import { NowIndicatorProps } from './index.types';
import Typography from '@components/typography';

const NowIndicator = ({ type }: NowIndicatorProps) => {
  const { t } = useAppTranslation();

  return (
    <Typography
      className="label-small-medium"
      textAlign="center"
      color={
        type === 'midweek' ? 'var(--accent-dark)' : 'var(--weekend-meeting)'
      }
    >
      • {t('tr_today')}
    </Typography>
  );
};

export default NowIndicator;
