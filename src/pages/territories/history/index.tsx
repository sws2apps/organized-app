import { useState } from 'react';
import { Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import { useBreakpoints } from '@hooks/index';
import { IconExport } from '@icons/index';
import PageTitle from '@components/page_title';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import TerritoriesHistory from '@features/territories/history';
import useExportS13 from '@features/territories/history/useExportS13';
import ExportS13Dialog from '@features/territories/history/export_s13_dialog';

const TerritoryHistoryPage = () => {
  const navigate = useNavigate();

  const parent = (useLocation().state as { parent?: string } | null)?.parent;
  const { tablet688Up } = useBreakpoints();

  const { handleExport, isProcessing } = useExportS13();

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
        title="Assignment history"
        secondaryTitle={parent}
        onBack={() => (parent ? navigate(-1) : navigate('/territories'))}
        buttons={
          <NavBarButtonGroup>
            <NavBarButton
              text="Export S-13"
              icon={<IconExport />}
              onClick={() => setExportOpen(true)}
            />
          </NavBarButtonGroup>
        }
      />

      {exportOpen && (
        <ExportS13Dialog
          isProcessing={isProcessing}
          onClose={() => setExportOpen(false)}
          onExport={async (year) => {
            await handleExport(year);
            setExportOpen(false);
          }}
        />
      )}

      <TerritoriesHistory />
    </Box>
  );
};

export default TerritoryHistoryPage;
