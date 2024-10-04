import { IconCancelCicle } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { LabelContainer } from '../index.styles';
import Typography from '@components/typography';

const RejectedLabel = () => {
  const { t } = useAppTranslation();

  return (
    <LabelContainer sx={{ backgroundColor: 'var(--red-main)' }}>
      <IconCancelCicle color="var(--always-white)" />
      <Typography className="button-caps" color="var(--always-white)">
        {t('tr_rejected')}
      </Typography>
    </LabelContainer>
  );
};

export default RejectedLabel;
