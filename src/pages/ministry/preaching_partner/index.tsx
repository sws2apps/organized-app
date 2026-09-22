import { Box } from '@mui/material';
import { IconAddPerson } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import usePreachingPartner from './usePreachingPartner';
import CongregationRequests from '@features/ministry/preaching_partner/congregation_requests';
import MyRequests from '@features/ministry/preaching_partner/my_requests';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import PageTitle from '@components/page_title';
import PreachingPartnerEditor from '@features/ministry/preaching_partner/request_editor';
import PreachingPartnerNav from '@features/ministry/preaching_partner/requests_nav';

const PreachingPartner = () => {
  const { t } = useAppTranslation();

  const { desktopUp, tablet688Up } = useBreakpoints();

  const { tab, setTab, isEditorOpen, handleOpenEditor, handleCloseEditor } =
    usePreachingPartner();

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
        title={t('tr_findPreachingPartner')}
        buttons={
          <NavBarButtonGroup>
            <NavBarButton
              text={t('tr_newPartnerRequest')}
              icon={<IconAddPerson />}
              onClick={handleOpenEditor}
            ></NavBarButton>
          </NavBarButtonGroup>
        }
      />

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start',
          flexDirection: desktopUp ? 'row' : 'column',
        }}
      >
        <Box sx={{ width: desktopUp ? '400px' : '100%', flexShrink: 0 }}>
          <PreachingPartnerNav value={tab} onChange={setTab} />
        </Box>

        <Box sx={{ flex: 1, width: '100%', minWidth: 0 }}>
          {tab === 'mine' ? <MyRequests /> : <CongregationRequests />}
        </Box>
      </Box>

      {isEditorOpen && (
        <PreachingPartnerEditor
          open={isEditorOpen}
          onClose={handleCloseEditor}
        />
      )}
    </Box>
  );
};

export default PreachingPartner;
