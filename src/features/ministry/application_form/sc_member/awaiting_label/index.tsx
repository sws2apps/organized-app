import { IconLoadingHourglass } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { LabelContainer } from '../index.styles';
import Typography from '@components/typography';

const AwaitingLabel = () => {
  const { t } = useAppTranslation();

  return (
    <LabelContainer sx={{ backgroundColor: 'var(--accent-150)' }}>
      <IconLoadingHourglass color="var(--accent-350)" />
      <Typography className="button-caps" color="var(--accent-350)">
        {t('tr_awaiting')}
      </Typography>
    </LabelContainer>
  );
};

export default AwaitingLabel;
