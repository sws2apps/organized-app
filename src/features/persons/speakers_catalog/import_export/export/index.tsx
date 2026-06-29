//src/features/persons/speakers_catalog/import_export/export/index.tsx
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

  // State: Which format was clicked? If "null", we show the selection boxes.
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(null);

  // Initialize all fields as "selected" (true) by default
  const initialFields = useMemo(() => {
    const fields: Record<string, boolean> = {};
    SPEAKER_FIELD_META.forEach((field) => {
      fields[field.key] = true;
    });
    return fields;
  }, [SPEAKER_FIELD_META]);

  const [selectedFields, setSelectedFields] =
    useState<Record<string, boolean>>(initialFields);

  // Group the fields (e.g. "Speaker", "Congregation", "Talks")
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

  // Master Checkbox Logic (Select All)
  const selectedAll = useMemo(() => {
    return Object.values(selectedFields).every(Boolean);
  }, [selectedFields]);

  const indeterminateAll = useMemo(() => {
    const someSelected = Object.values(selectedFields).some(Boolean);
    return someSelected && !selectedAll;
  }, [selectedFields, selectedAll]);

  // Handlers
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

    try {
      // 1. Wait until the file is generated and downloaded
      await handleExport(selectedFormat, selectedFields);

      // 2. Close the dialog if no error was thrown
      props.onClose();
    } catch (error) {
      // Any potential error is already displayed via Snack Notification
      // in useExportSpeakers. The dialog remains open.
      console.error('Export failed:', error);
    }
  };

  // --- VIEW 1: Field selection (Checkboxes similar to Import-Style) ---
  if (selectedFormat !== null) {
    return (
      <Stack spacing="16px" sx={{ width: '100%' }}>
        <Typography className="h2">{t('tr_chooseFields')}</Typography>
        <Typography color="var(--grey-400)">
          {t('tr_chooseFieldsDesc')}
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

            {/* Dynamically generated groups and fields in a two-column layout */}
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
                      {/* Group Checkbox */}
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

                      {/* Checkboxes for individual fields */}
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
            endIcon={isProcessing ? <IconLoading /> : undefined}
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

  // --- VIEW 2: Initial view (The two clickable boxes) ---
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
        onKeyDown={(e) => {
          if (isProcessing) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFormatClick('xlsx');
          }
        }}
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
        role="button"
        tabIndex={isProcessing ? -1 : 0}
        aria-disabled={isProcessing}
        spacing="16px"
        padding="16px"
        borderRadius="var(--radius-m)"
        bgcolor="var(--accent-150)"
        onClick={() => handleFormatClick('csv')}
        onKeyDown={(e) => {
          if (isProcessing) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFormatClick('csv');
          }
        }}
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
