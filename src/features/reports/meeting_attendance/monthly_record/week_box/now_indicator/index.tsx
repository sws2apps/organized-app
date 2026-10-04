import { useAppTranslation } from '@hooks/index';
import { NowIndicatorProps } from './index.types';
import Typography from '@components/typography';

const NowIndicator = ({ type }: NowIndicatorProps) => {
  const { t } = useAppTranslation();

  return (
    <Typography
      className="label-small-medium"
      color={
        type === 'midweek' ? 'var(--accent-dark)' : 'var(--weekend-meeting)'
      }
      sx={{
        textAlign: 'center',
      }}
    >
      • {t('tr_today')}
    </Typography>
  );
};

export default NowIndicator;
