import { IconLoading } from '@icons/index';
import { StyledCircleBox } from './loading.styles';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';

const AppLoading = () => {
  const { t } = useAppTranslation();

  return (
    <StyledCircleBox className="pop-up-shadow">
      <IconLoading color="var(--accent-main)" width={72} height={72} />
      <Typography className="h4" color="var(--accent-main)">
        {t('tr_loading')}
      </Typography>
    </StyledCircleBox>
  );
};

export default AppLoading;
