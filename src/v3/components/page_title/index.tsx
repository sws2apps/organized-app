import { IconArrowBack } from '@icons';
import { Typography } from '@components';
import { PageTitleProps } from './page_title.types';
import { PageTitleBlock, PageTitleButtonsContainer, PageTitleContainer, PageTitleIcon } from './page_title.styles';
import usePageTitle from './usePageTitle';

const PageTitle = (props: PageTitleProps) => {
  const { backTo, title, buttons } = props;

  const { handleArrowBackAction } = usePageTitle(backTo);

  return (
    <PageTitleContainer>
      <PageTitleBlock>
        <PageTitleIcon onClick={handleArrowBackAction}>
          <IconArrowBack />
        </PageTitleIcon>

        <Typography className="h1">{title}</Typography>
      </PageTitleBlock>

      {buttons && <PageTitleButtonsContainer>{buttons}</PageTitleButtonsContainer>}
    </PageTitleContainer>
  );
};

export default PageTitle;
