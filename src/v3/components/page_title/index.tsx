import { IconArrowBack } from '@icons/index';
import Typography from '@components/typography';
import { PageTitleProps } from './page_title.types';
import { PageTitleBlock, PageTitleButtonsContainer, PageTitleContainer } from './page_title.styles';
import usePageTitle from './usePageTitle';

const PageTitle = (props: PageTitleProps) => {
  const { backTo, title, buttons } = props;

  const { handleArrowBackAction } = usePageTitle(backTo);

  return (
    <PageTitleContainer>
      <PageTitleBlock onClick={handleArrowBackAction}>
        <IconArrowBack color="var(--black)" />

        <Typography className="h1">{title}</Typography>
      </PageTitleBlock>

      {buttons && <PageTitleButtonsContainer>{buttons}</PageTitleButtonsContainer>}
    </PageTitleContainer>
  );
};

export default PageTitle;
