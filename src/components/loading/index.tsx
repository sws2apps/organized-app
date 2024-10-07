import { IconLoading } from '@icons/index';
import Typography from '@components/typography';
import { StyledCircleBox } from './index.styles';
import { useAppTranslation } from '@hooks/index';
import { AppLoadingType } from './index.types';
import Organized3DLoader from '@components/organized_3d_loader';

/**
 * Component for displaying a loading indicator.
 * @returns JSX element for the AppLoading component.
 */
const AppLoading = ({ text, sx }: AppLoadingType) => {
  const { t } = useAppTranslation();

  const loadingText = text || t('tr_loading');

  return (
    <StyledCircleBox sx={sx}>
      <Organized3DLoader width={72} height={72} />
      <Typography align="center" className="h4" color="var(--accent-main)">
        {loadingText}
      </Typography>
    </StyledCircleBox>
  );
};

export default AppLoading;
