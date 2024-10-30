import { useAppTranslation } from '@hooks/index';
import { Container } from './index.styles';
import { AppLoadingType } from './index.types';
import LottieLoader from '@components/lottie_loader';
import Typography from '@components/typography';
/**
 * Component for displaying a loading indicator.
 * @returns JSX element for the AppLoading component.
 */
const AppLoading = ({ text, sx }: AppLoadingType) => {
  const { t } = useAppTranslation();

  const loadingText = text || t('tr_loading');

  return (
    <Container sx={sx}>
      <LottieLoader />
      <Typography align="center" className="h4" color="var(--accent-main)">
        {loadingText}
      </Typography>
    </Container>
  );
};

export default AppLoading;
