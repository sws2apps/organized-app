import { Box, Slide } from '@mui/material';
import { IconPrepareReport } from '@components/icons';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import useFieldService from './useFieldService';
import PageTitle from '@components/page_title';
import PersonsList from '@features/reports/field_service/persons_list';
import ReportDetails from '@features/reports/field_service/report_details';
import SelectorStats from '@features/reports/field_service/selector_stats';
import NavBarButton from '@components/nav_bar_button';

const FieldService = () => {
  const { t } = useAppTranslation();

  const { desktopUp, tablet688Up } = useBreakpoints();

  const { isSecretary, isGroup } = useCurrentUser();

  const { editorOpen, handleOpenBranchReport } = useFieldService();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        paddingBottom: !tablet688Up ? '60px' : 'none',
      }}
    >
      <PageTitle
        title={t('tr_fieldServiceReports')}
        buttons={
          <>
            {!isGroup && isSecretary && (
              <NavBarButton
                main
                text={t('tr_createS1')}
                icon={<IconPrepareReport />}
                onClick={handleOpenBranchReport}
              ></NavBarButton>
            )}
          </>
        }
      />

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start',
          '& > .MuiBox-root': {
            width: desktopUp ? '50%' : '100%',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SelectorStats />

          {desktopUp && <PersonsList />}

          {/* < desktop view */}
          {!desktopUp && (
            <Box
              sx={{
                position: 'relative',
                overflowX: 'clip',
              }}
            >
              <Slide direction="right" in={!editorOpen} unmountOnExit>
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    paddingBottom: '32px',
                  }}
                >
                  <PersonsList />
                </Box>
              </Slide>
              <Slide direction="left" in={editorOpen} unmountOnExit>
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    paddingBottom: '32px',
                  }}
                >
                  <ReportDetails />
                </Box>
              </Slide>
            </Box>
          )}
        </Box>

        {desktopUp && <ReportDetails />}
      </Box>
    </Box>
  );
};

export default FieldService;
