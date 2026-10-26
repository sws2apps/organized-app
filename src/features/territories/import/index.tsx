import { Box, Stack } from '@mui/material';
import {
  AutoComplete,
  Button,
  InfoNote,
  MenuItem,
  Select,
  Typography,
} from '@components/index';
import Dialog from '@components/dialog';
import WaitingLoader from '@components/waiting_loader';
import { IconImportFile } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import type { TerritoryImportDateOrder } from '@definition/territory_import';
import useTerritoryImport from '@features/territories/import/useTerritoryImport';

const TerritoryImport = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: VoidFunction;
}) => {
  const { t } = useAppTranslation();
  const importer = useTerritoryImport(open, onClose);
  const { result, error, processing, saving } = importer;
  const counts = result
    ? ([
        ['tr_territoryImportAdded', result.added],
        ['tr_territoryImportUpdated', result.updated],
        ['tr_assignments', result.assignments],
        ['tr_territoryDoNotCallLabel', result.doNotCalls],
        ['tr_territoryImportBoundaries', result.boundaries],
      ] as const)
    : [];
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!saving) onClose();
      }}
      title={t('tr_territoryImportTerritories')}
      description={t('tr_territoryImportDescription')}
    >
      <Stack spacing="16px" sx={{ width: '100%' }}>
        {error && (
          <Box role="alert">
            <Typography color="var(--red-main)">{error}</Typography>
          </Box>
        )}
        {!result && !saving && (
          <>
            <Button variant="small" onClick={importer.downloadTemplate}>
              {t('tr_territoryImportDownloadTemplate')}
            </Button>
            <InfoNote message={t('tr_territoryImportTemplateHelp')} />
          </>
        )}
        {!result && !processing && (
          <Box
            {...importer.getRootProps({
              role: 'button',
              'aria-label': t('tr_territoryImportChooseFiles'),
            })}
            sx={{
              border: '1px dashed var(--accent-dark)',
              borderRadius: 'var(--radius-l)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'var(--accent-100)' },
            }}
          >
            <input
              {...importer.getInputProps()}
              aria-label={t('tr_territoryImportChooseFiles')}
            />
            <IconImportFile color="var(--accent-dark)" />
            <Typography className="button-caps" color="var(--accent-dark)">
              {t('tr_territoryDragOrClickToChoose')}
            </Typography>
            <Typography className="body-small-regular">
              {t('tr_territoryImportFormats')}
            </Typography>
          </Box>
        )}
        {!!importer.files.length && (
          <Typography
            className="body-small-regular"
            sx={{ overflowWrap: 'anywhere' }}
          >
            {importer.files.map((file) => file.name).join(', ')}
          </Typography>
        )}
        <Select
          label={t('tr_territoryImportDateOrder')}
          value={importer.dateOrder}
          disabled={saving}
          onChange={(event) =>
            importer.setDateOrder(
              event.target.value as TerritoryImportDateOrder
            )
          }
        >
          {(
            [
              ['iso', 'tr_territoryImportDate_iso'],
              ['day', 'tr_territoryImportDate_day'],
              ['month', 'tr_territoryImportDate_month'],
            ] as const
          ).map(([order, label]) => (
            <MenuItem key={order} value={order}>
              <Typography>{t(label)}</Typography>
            </MenuItem>
          ))}
        </Select>
        {processing && (
          <Box role="status" aria-label={t('tr_territoryImportReading')}>
            <WaitingLoader variant="standard" size={60} />
          </Box>
        )}
        {result && (
          <>
            <Stack spacing="8px" role="status" aria-live="polite">
              {counts.map(([key, count]) => (
                <Stack
                  key={key}
                  direction="row"
                  sx={{ justifyContent: 'space-between', gap: '16px' }}
                >
                  <Typography>{t(key)}</Typography>
                  <Typography className="body-small-semibold">
                    {count}
                  </Typography>
                </Stack>
              ))}
            </Stack>
            <Stack spacing="8px">
              {result.sample.map((entry) => (
                <Typography
                  key={entry.number}
                  className="body-small-regular"
                  sx={{ overflowWrap: 'anywhere' }}
                >
                  {entry.number}
                  {entry.name ? ` · ${entry.name}` : ''}
                </Typography>
              ))}
              {!!result.remaining && (
                <Typography className="body-small-regular">
                  {t('tr_territoryImportMorePreview', {
                    count: result.remaining,
                  })}
                </Typography>
              )}
            </Stack>
            <InfoNote message={t('tr_territoryImportPreserveData')} />
            {result.notices.map((notice, index) => (
              <InfoNote
                key={`${notice.key}-${index}`}
                message={t(notice.key, notice.values)}
              />
            ))}
            {!!result.missing.length && (
              <InfoNote message={t('tr_territoryImportMatchPublishers')} />
            )}
            {importer.publisherNames.map((name) => (
              <AutoComplete
                key={name}
                label={t('tr_territoryImportMatchPublisher', { name })}
                options={importer.assignees}
                getOptionLabel={(person) =>
                  typeof person === 'string' ? person : person.name
                }
                isOptionEqualToValue={(a, b) =>
                  typeof b !== 'string' && a.id === b.id
                }
                getOptionKey={(person) =>
                  typeof person === 'string' ? person : person.id
                }
                value={
                  importer.assignees.find(
                    (person) => person.id === importer.matches[name]
                  ) ?? null
                }
                onChange={(_event, person) => {
                  if (!person)
                    importer.setMatches((current) => ({
                      ...current,
                      [name]: '',
                    }));
                  if (
                    person &&
                    !Array.isArray(person) &&
                    typeof person !== 'string'
                  )
                    importer.setMatches((current) => ({
                      ...current,
                      [name]: person.id,
                    }));
                }}
              />
            ))}
            <Button
              variant="main"
              disabled={
                saving || !!error || !!result.missing.length || !importer.editor
              }
              onClick={importer.handleImport}
            >
              {saving ? (
                <WaitingLoader size={20} variant="standard" />
              ) : (
                t('tr_import')
              )}
            </Button>
          </>
        )}
        {!!importer.files.length && (
          <Button
            variant="tertiary"
            disabled={saving || processing}
            onClick={importer.chooseAgain}
          >
            {t('tr_territoryImportChooseAgain')}
          </Button>
        )}
        <Button variant="secondary" disabled={saving} onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Dialog>
  );
};
export default TerritoryImport;
