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
      // a word that does not fit wraps onto a hidden second line, leaving the dot
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        columnGap: '4px',
        height: '14px',
        overflow: 'hidden',
      }}
    >
      <span>•</span>
      <span>{t('tr_today')}</span>
    </Typography>
  );
};

export default NowIndicator;
