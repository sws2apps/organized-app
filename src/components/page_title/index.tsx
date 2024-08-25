import { IconArrowBack, IconSettings } from '@icons/index';
import Typography from '@components/typography';
import { PageTitleProps } from './index.types';
import {
  PageTitleBlock,
  PageTitleButtonsContainer,
  PageTitleContainer,
} from './index.styles';
import usePageTitle from './usePageTitle';
import IconButton from '@components/icon_button';

/**
 * Component for displaying a page title with optional back button and additional buttons.
 * @param props - The props for the PageTitle component.
 * @returns A React element representing the PageTitle component.
 */
const PageTitle = ({ title, buttons, quickAction }: PageTitleProps) => {
  const { handleArrowBackAction } = usePageTitle();

  return (
    <PageTitleContainer>
      <PageTitleBlock onClick={handleArrowBackAction}>
        <IconArrowBack color="var(--black)" />

        <Typography className="h1">{title}</Typography>

        {quickAction && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              quickAction();
            }}
          >
            <IconSettings />
          </IconButton>
        )}
      </PageTitleBlock>

      {buttons && (
        <PageTitleButtonsContainer>{buttons}</PageTitleButtonsContainer>
      )}
    </PageTitleContainer>
  );
};

export default PageTitle;
