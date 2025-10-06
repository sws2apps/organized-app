import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAppTranslation } from '@hooks/index';
import useImportExport from './useImportExport';
import useTemplateDownload from './useTemplateDownload';
import { ImportExportType } from './index.types';
import ConfirmImport from './confirm_import';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import Tabs from '@components/tabs';

const ImportExport = (props: ImportExportType) => {
  const { t } = useAppTranslation();
  const { downloadTemplate } = useTemplateDownload();
  const [tipsExpanded, setTipsExpanded] = useState(false);

  const {
    tabs,
    handleTabChange,
    value,
    state,
    handleOpenImportExport,
    fileData,
  } = useImportExport(props);

  const handleDownloadTemplate = () => {
    downloadTemplate();
  };

  const handleToggleTips = () => {
    setTipsExpanded(!tipsExpanded);
  };

  return (
    <Dialog onClose={props.onClose} open={props.open} sx={{ padding: '24px' }}>
      {state === 'import/export' && (
        <Stack
          spacing="16px"
          sx={{
            alignItems: 'flex-start',
            width: '100%',
            margin: 0,
            padding: 0,
          }}
        >
          <Typography className="h2">
            {t('tr_importExportPersonsTitle')}
          </Typography>

          <Typography color="var(--grey-400)">
            {value === 0 ? (
              t('tr_exportPersonsDesc')
            ) : (
              <>
                {t('tr_importPersonsDesc_before')}
                <Link
                  component="button"
                  onClick={handleDownloadTemplate}
                  sx={{
                    color: 'var(--accent-dark)',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    border: 'none',
                    background: 'none',
                    padding: 0,
                  }}
                >
                  {t('tr_importPersonsDesc_template')}
                </Link>
                {t('tr_importPersonsDesc_after')}
              </>
            )}
          </Typography>
          {value === 1 && (
            <Box
              sx={{
                width: '100%',
                maxWidth: '452px', // Figma-Vorgabe
                backgroundColor: 'var(--grey-50)',
                borderRadius: '4px',
              }}
            >
              {/* Clickable Header */}
              <Box
                onClick={handleToggleTips}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  height: '24px', // Figma-Vorgabe
                  width: '100%',
                  padding: 0,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'var(--grey-100)',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Inter',
                    fontWeight: 550,
                    fontSize: '16px',
                    lineHeight: '20px',
                    color: '#505050',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0,
                    minWidth: '151px', // Figma-Vorgabe
                  }}
                >
                  {t('tr_templateFillingTips')}
                </Typography>
                <ExpandMoreIcon
                  sx={{
                    width: '24px',
                    height: '24px',
                    color: '#505050',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0,
                    transform: tipsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </Box>

              {/* Collapsible Content */}
              <Collapse in={tipsExpanded}>
                <Box
                  component="ul"
                  sx={{
                    pl: 2,
                    m: 0,
                    '& li': {
                      lineHeight: 1.25,
                      margin: 0,
                      padding: 0,
                      color: 'var(--grey-400)',
                    },
                  }}
                >
                  <Box component="li">{t('tr_tip_followStructure')}</Box>
                  <Box component="li">{t('tr_tip_enterYes')}</Box>
                  <Box component="li">{t('tr_tip_separators')}</Box>
                  <Box component="li">{t('tr_tip_relevantColumns')}</Box>
                </Box>
              </Collapse>
            </Box>
          )}

          <Box sx={{ marginBottom: '-24px !important', width: '100%' }}>
            <Tabs tabs={tabs} onChange={handleTabChange} value={value} />
          </Box>
        </Stack>
      )}

      {state === 'import/confirm' && (
        <ConfirmImport
          filedata={fileData}
          onBack={handleOpenImportExport}
          onClose={props.onClose}
        />
      )}
    </Dialog>
  );
};

export default ImportExport;
