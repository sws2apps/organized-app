import { Box, Slide } from '@mui/material';
import { IconPrepareReport } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useFieldService from './useFieldService';
import Button from '@components/button';
import PageTitle from '@components/page_title';
import PersonsList from '@features/reports/field_service/persons_list';
import ReportDetails from '@features/reports/field_service/report_details';
import SelectorStats from '@features/reports/field_service/selector_stats';

const FieldService = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const { editorOpen, handleOpenBranchReport } = useFieldService();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
      }}
    >
      <PageTitle
        title={t('tr_fieldServiceReports')}
        buttons={
          <Button
            startIcon={<IconPrepareReport />}
            onClick={handleOpenBranchReport}
          >
            {t('tr_createS1')}
          </Button>
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
