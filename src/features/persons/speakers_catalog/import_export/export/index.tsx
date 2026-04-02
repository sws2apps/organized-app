import { useState, useMemo, ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { IconBackupOrganized } from '@components/icons';
import IconLoading from '@components/icon_loading';
import Button from '@components/button';
import Checkbox from '@components/checkbox';
import Divider from '@components/divider';
import Typography from '@components/typography';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useExportSpeakers from './useExportSpeakers';
import useSpeakersImportConfig from '../confirm_import/useSpeakersImportConfig';
import type { ExportType } from './index.types';

type ExportFormat = 'xlsx' | 'csv' | null;

const ExportSpeakers = (props: ExportType) => {
  const { t } = useAppTranslation();
  const { tabletDown } = useBreakpoints();
  const { fileNameXlsx, fileNameCsv, isProcessing, handleExport } =
    useExportSpeakers();
  const { SPEAKER_FIELD_META } = useSpeakersImportConfig();

  // State: Welches Format wurde angeklickt? Wenn "null", zeigen wir die Boxen.
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(null);

  // Initialisiere alle Felder standardmäßig als "ausgewählt" (true)
  const initialFields = useMemo(() => {
    const fields: Record<string, boolean> = {};
    SPEAKER_FIELD_META.forEach((field) => {
      fields[field.key] = true;
    });
    return fields;
  }, [SPEAKER_FIELD_META]);

  const [selectedFields, setSelectedFields] =
    useState<Record<string, boolean>>(initialFields);

  // Gruppiere die Felder (z. B. "Redner", "Versammlung", "Vorträge")
  const groupedFields = useMemo(() => {
    const groups: Record<
      string,
      { groupLabel: string; fields: typeof SPEAKER_FIELD_META }
    > = {};
    SPEAKER_FIELD_META.forEach((field) => {
      if (!groups[field.group]) {
        groups[field.group] = { groupLabel: field.groupLabel, fields: [] };
      }
      groups[field.group].fields.push(field);
    });
    return groups;
  }, [SPEAKER_FIELD_META]);

  // Master Checkbox Logic (Alle)
  const selectedAll = useMemo(() => {
    return Object.values(selectedFields).every(Boolean);
  }, [selectedFields]);

  const indeterminateAll = useMemo(() => {
    const someSelected = Object.values(selectedFields).some(Boolean);
    return someSelected && !selectedAll;
  }, [selectedFields, selectedAll]);

  // Handler
  const handleFormatClick = (format: ExportFormat) => {
    if (isProcessing) return;
    setSelectedFormat(format);
  };

  const handleSelectField = (key: string, checked: boolean) => {
    setSelectedFields((prev) => ({ ...prev, [key]: checked }));
  };

  const handleSelectData = (group: string, checked: boolean) => {
    setSelectedFields((prev) => {
      const next = { ...prev };
      SPEAKER_FIELD_META.filter((f) => f.group === group).forEach((f) => {
        next[f.key] = checked;
      });
      return next;
    });
  };

  const handleSelectAll = (
    _: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setSelectedFields((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        next[key] = checked;
      });
      return next;
    });
  };

  const handleDownload = async () => {
    if (isProcessing || !selectedFormat) return;
    if (Object.values(selectedFields).every((v) => !v)) return;
    await handleExport(selectedFormat, selectedFields);
  };

  // --- ANSICHT 1: Feldauswahl (Checkboxen im Import-Style) ---
  if (selectedFormat !== null) {
    return (
      <Stack spacing="16px" sx={{ width: '100%' }}>
        <Typography className="h2">
          {t('tr_chooseFields', 'Zu exportierende Felder')}
        </Typography>
        <Typography color="var(--grey-400)">
          {t(
            'tr_chooseFieldsDesc',
            'Bitte wähle die Felder aus, die in der Datei enthalten sein sollen:'
          )}
        </Typography>

        <Stack
          spacing="16px"
          padding="16px"
          borderRadius="var(--radius-m)"
          bgcolor="var(--accent-150)"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconBackupOrganized color="var(--accent-dark)" />
            <Typography className="h4" color="var(--accent-dark)">
              {selectedFormat === 'xlsx' ? fileNameXlsx : fileNameCsv}
            </Typography>
          </Box>

          <Divider color="var(--accent-200)" />

          <Stack spacing="8px">
            {/* Select All Checkbox */}
            <Checkbox
              checked={selectedAll}
              indeterminate={indeterminateAll}
              onChange={handleSelectAll}
              label={
                <Typography
                  className="body-small-semibold"
                  color="var(--accent-dark)"
                >
                  {t('tr_selectAll')}
                </Typography>
              }
            />

            {/* Dynamisch generierte Gruppen und Felder im Zwei-Spalten-Layout */}
            <Box sx={{ columnCount: tabletDown ? 1 : 2, columnGap: '24px' }}>
              {Object.entries(groupedFields).map(([groupKey, groupData]) => {
                const fields = groupData.fields;
                const selectedCount = fields.filter(
                  (field) => selectedFields[field.key]
                ).length;
                const groupIndeterminate =
                  selectedCount > 0 && selectedCount < fields.length;
                const isGroupSelected = selectedCount === fields.length;

                return (
                  <Box
                    key={groupKey}
                    sx={{ breakInside: 'avoid', marginBottom: '16px' }}
                  >
                    <Stack spacing="4px">
                      {/* Gruppen-Checkbox */}
                      <Checkbox
                        checked={isGroupSelected}
                        indeterminate={groupIndeterminate}
                        onChange={(_, checked) =>
                          handleSelectData(groupKey, checked)
                        }
                        label={
                          <Typography
                            className="body-small-semibold"
                            color="var(--accent-dark)"
                          >
                            {t(groupData.groupLabel)}
                          </Typography>
                        }
                      />

                      {/* Checkboxen für einzelne Felder */}
                      <Stack spacing="2px" sx={{ marginLeft: '24px' }}>
                        {fields.map((field) => (
                          <Checkbox
                            key={field.key}
                            checked={selectedFields[field.key] ?? false}
                            onChange={(_, checked) =>
                              handleSelectField(field.key, checked)
                            }
                            label={
                              <Typography
                                className="body-small-regular"
                                color="var(--accent-dark)"
                                sx={{ fontSize: '0.875rem' }}
                              >
                                {t(field.label)}
                              </Typography>
                            }
                          />
                        ))}
                      </Stack>
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          </Stack>
        </Stack>

        <Stack spacing="8px">
          <Button
            variant="main"
            onClick={handleDownload}
            disabled={
              Object.values(selectedFields).every((v) => !v) || isProcessing
            }
            endIcon={isProcessing && <IconLoading />}
          >
            {t('tr_download')}
          </Button>
          <Button
            variant="secondary"
            disabled={isProcessing}
            onClick={() => setSelectedFormat(null)}
          >
            {t('tr_back')}
          </Button>
        </Stack>
      </Stack>
    );
  }

  // --- ANSICHT 2: Startansicht (Die zwei klickbaren Boxen) ---
  return (
    <Stack spacing="16px">
      <Typography className="body-regular" color="var(--grey-400)">
        {t('tr_exportSpeakersDesc')}
      </Typography>

      <Stack
        spacing="16px"
        padding="16px"
        borderRadius="var(--radius-m)"
        bgcolor="var(--accent-150)"
        onClick={() => handleFormatClick('xlsx')}
        sx={{
          cursor: isProcessing ? 'default' : 'pointer',
          opacity: isProcessing ? 0.6 : 1,
          transition: 'background-color 0.2s ease',
          '&:hover': {
            bgcolor: isProcessing ? 'var(--accent-150)' : 'var(--accent-200)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconBackupOrganized color="var(--accent-dark)" />
          <Typography className="h4" color="var(--accent-dark)">
            {fileNameXlsx}
          </Typography>
        </Box>
      </Stack>

      <Stack
        spacing="16px"
        padding="16px"
        borderRadius="var(--radius-m)"
        bgcolor="var(--accent-150)"
        onClick={() => handleFormatClick('csv')}
        sx={{
          cursor: isProcessing ? 'default' : 'pointer',
          opacity: isProcessing ? 0.6 : 1,
          transition: 'background-color 0.2s ease',
          '&:hover': {
            bgcolor: isProcessing ? 'var(--accent-150)' : 'var(--accent-200)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconBackupOrganized color="var(--accent-dark)" />
          <Typography className="h4" color="var(--accent-dark)">
            {fileNameCsv}
          </Typography>
        </Box>
      </Stack>

      <Stack spacing="8px">
        <Button
          variant="secondary"
          disabled={isProcessing}
          onClick={props.onClose}
        >
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default ExportSpeakers;
