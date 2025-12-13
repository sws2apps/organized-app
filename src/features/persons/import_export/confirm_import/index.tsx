import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconImportCSV from '@components/icons/IconImportCSV';
import Button from '@components/button';
import Checkbox from '@components/checkbox';
import Divider from '@components/divider';
import IconLoading from '@components/icon_loading';
import Typography from '@components/typography';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useConfirmImport from './useConfirmImport';
import useCSVImport from './useCSVImport';
import usePersonsImportConfig from './usePersonsImportConfig';
import type { ConfirmImportProps } from './index.types';

const ConfirmImport = (props: ConfirmImportProps) => {
  const { t } = useAppTranslation();
  const { tabletDown } = useBreakpoints();
  const { PERSON_FIELD_META } = usePersonsImportConfig();
  const filename = props.filedata?.file?.name || 'unknown.csv';
  const { getCSVHeaders } = useCSVImport();
  const {
    isProcessing,
    handleImportData,
    handleSelectData,
    handleSelectField,
    selected,
    selectedFields,
    selectedAll,
    inderterminate,
    handleSelectAll,
    personsContents,
  } = useConfirmImport(props);

  const csvHeaders = getCSVHeaders(personsContents);

  // Grouping the fields by groups
  const groupedFields = PERSON_FIELD_META.reduce(
    (acc, field) => {
      if (!acc[field.group]) {
        acc[field.group] = [];
      }
      acc[field.group].push(field);
      return acc;
    },
    {} as Record<string, typeof PERSON_FIELD_META>
  );

  return (
    <Stack spacing="16px" sx={{ width: '100%' }}>
      <Typography className="h2">{t('tr_importDataConfirm')}</Typography>

      <Typography color="var(--grey-400)">
        {t('tr_importPersonsDataConfirmDesc')}
      </Typography>

      <Stack
        spacing="16px"
        padding="16px"
        borderRadius="var(--radius-m)"
        bgcolor="var(--accent-150)"
        divider={<Divider color="var(--accent-200)" />}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconImportCSV color="var(--accent-dark)" />
          <Typography className="h4" color="var(--accent-dark)">
            {filename}
          </Typography>
        </Box>

        <Stack spacing="8px">
          {/* Select all checkbox */}
          <Checkbox
            checked={selectedAll}
            indeterminate={inderterminate}
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

          {/* dynamically generate groups and fields */}
          <Box
            sx={{
              columnCount: tabletDown ? 1 : 2,
              columnGap: '24px',
            }}
          >
            {Object.entries(groupedFields).map(([groupKey, fields]) => {
              // Calculate indeterminate state for group checkbox
              const isGroupFieldAvailable = fields.some((field) =>
                csvHeaders.includes(field.key)
              );
              const availableFields = fields.filter((field) =>
                csvHeaders.includes(field.key)
              );
              const selectedCount = availableFields.filter(
                (field) => selectedFields[field.key]
              ).length;
              const groupIndeterminate =
                selectedCount > 0 && selectedCount < availableFields.length;

              return (
                <Box
                  key={groupKey}
                  sx={{ breakInside: 'avoid', marginBottom: '16px' }}
                >
                  <Stack spacing="4px">
                    {/* Group checkbox */}
                    <Checkbox
                      checked={selected[groupKey] || false}
                      indeterminate={groupIndeterminate}
                      disabled={!isGroupFieldAvailable}
                      onChange={(_, checked) =>
                        handleSelectData(groupKey, checked)
                      }
                      label={
                        <Typography
                          className="body-small-semibold"
                          color={
                            isGroupFieldAvailable
                              ? 'var(--accent-dark)'
                              : 'var(--grey-400)'
                          }
                        >
                          {t(fields[0].groupLabel)}
                        </Typography>
                      }
                    />

                    {/* Individual field checkboxes */}
                    <Stack spacing="2px" sx={{ marginLeft: '24px' }}>
                      {fields.map((field) => {
                        const isFieldAvailable = csvHeaders.includes(field.key);

                        return (
                          <Checkbox
                            key={field.key}
                            checked={selectedFields[field.key] || false}
                            disabled={!isFieldAvailable}
                            onChange={(_, checked) =>
                              handleSelectField(field.key, checked)
                            }
                            label={
                              <Typography
                                className="body-small-regular"
                                color={
                                  isFieldAvailable
                                    ? 'var(--accent-dark)'
                                    : 'var(--grey-400)'
                                }
                                sx={{
                                  fontSize: '0.875rem',
                                  opacity: isFieldAvailable ? 1 : 0.6,
                                }}
                              >
                                {t(field.label)}
                              </Typography>
                            }
                          />
                        );
                      })}
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
          onClick={handleImportData}
          endIcon={isProcessing && <IconLoading />}
        >
          {t('tr_import')}
        </Button>
        <Button variant="secondary" onClick={props.onBack}>
          {t('tr_back')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default ConfirmImport;
