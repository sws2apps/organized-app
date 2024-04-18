import { IconLoading } from '@icons/index';
import { StyledCircleBox } from './loading.styles';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';

/**
 * Component for displaying a loading indicator.
 * @returns JSX element for the AppLoading component.
 */
const AppLoading = () => {
  const { t } = useAppTranslation();

  return (
    <StyledCircleBox>
      <IconLoading color="var(--accent-main)" width={72} height={72} />
      <Typography className="h4" color="var(--accent-main)">
        {t('tr_loading')}
      </Typography>
    </StyledCircleBox>
  );
};

export default AppLoading;
