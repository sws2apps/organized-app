import { IconCheckCircle } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { LabelContainer } from '../index.styles';
import Typography from '@components/typography';

const ApprovedLabel = () => {
  const { t } = useAppTranslation();

  return (
    <LabelContainer sx={{ backgroundColor: 'var(--green-main)' }}>
      <IconCheckCircle color="var(--always-white)" />
      <Typography className="button-caps" color="var(--always-white)">
        {t('tr_approved')}
      </Typography>
    </LabelContainer>
  );
};

export default ApprovedLabel;
