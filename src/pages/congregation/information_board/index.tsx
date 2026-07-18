import { IconAdd } from '@components/icons';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import PageTitle from '@components/page_title';
import CategorySelector from '@features/congregation/information_board/category_selector';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import { Box } from '@mui/material';
import useInformationBoard from './userInformationBoard';

const InformationBoard = () => {
  const { t } = useAppTranslation();

  const { tablet688Up, desktopUp } = useBreakpoints();
  const { isAdmin } = useCurrentUser();

  const { currentCategory } = useInformationBoard();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        paddingBottom: !tablet688Up ? '60px' : '0px',
      }}
    >
      <PageTitle
        title={t('tr_informationBoard')}
        buttons={
          isAdmin && (
            <NavBarButtonGroup>
              <NavBarButton
                text={t('tr_add')}
                icon={<IconAdd />}
                onClick={() => {}}
              ></NavBarButton>
            </NavBarButtonGroup>
          )
        }
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: desktopUp ? 'row' : 'column',
          gap: '16px',
          alignItems: desktopUp ? 'flex-start' : 'unset',
        }}
      >
        <CategorySelector />
        {currentCategory}
      </Box>
    </Box>
  );
};

export default InformationBoard;
