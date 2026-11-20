import TerritorySyncStatus from '@features/territories/components/sync_status';
import useTerritoryAccess from '@features/territories/useTerritoryAccess';
import { useState } from 'react';
import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconExport } from '@icons/index';
import PageTitle from '@components/page_title';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import TerritoriesHistory from '@features/territories/history';
import ExportS13Dialog from '@features/territories/history/export_s13_dialog';
import useParentPage from '@features/territories/useParentPage';

const TerritoryHistoryPage = () => {
  const { t } = useAppTranslation();
  const { editor } = useTerritoryAccess();

  const { parent, goBack } = useParentPage('tr_territories', '/');
  const { tablet688Up } = useBreakpoints();

  const [exportOpen, setExportOpen] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        paddingBottom: tablet688Up ? '0px' : '60px',
      }}
    >
      <PageTitle
        title={t('tr_assignmentHistory')}
        secondaryTitle={parent}
        onBack={goBack}
        buttons={
          editor && (
            <NavBarButtonGroup>
              <NavBarButton
                text={t('tr_territoryExportS13')}
                icon={<IconExport />}
                onClick={() => setExportOpen(true)}
              />
            </NavBarButtonGroup>
          )
        }
      />
      <TerritorySyncStatus />

      {editor && exportOpen && (
        <ExportS13Dialog onClose={() => setExportOpen(false)} />
      )}

      <TerritoriesHistory />
    </Box>
  );
};

export default TerritoryHistoryPage;
