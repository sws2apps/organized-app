import { useAppTranslation } from '@hooks/index';
import { NowIndicatorProps } from './index.types';
import Typography from '@components/typography';

const NowIndicator = ({ type }: NowIndicatorProps) => {
  const { t } = useAppTranslation();

  return (
    <Typography
      className="label-small-medium"
      textAlign="center"
      color={`var(--${type}-meeting)`}
    >
      • {t('tr_today')}
    </Typography>
  );
};

export default NowIndicator;
