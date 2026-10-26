import { Box, Link, Stack } from '@mui/material';
import {
  Accordion,
  AutoComplete,
  Button,
  CustomDivider,
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
    ? (
        [
          ['tr_territoryImportAdded', result.added],
          ['tr_territoryImportUpdated', result.updated],
          ['tr_assignments', result.assignments],
          ['tr_territoryDoNotCallLabel', result.doNotCalls],
          ['tr_territoryImportBoundaries', result.boundaries],
        ] as const
      ).filter(([, count]) => count > 0)
    : [];
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!saving) onClose();
      }}
      title={t(
        result ? 'tr_territoryImportReview' : 'tr_territoryImportTerritories'
      )}
      description={
        !result && !processing && !importer.files.length ? (
          <>
            {t('tr_territoryImportIntro_before')}
            <Link
              component="button"
              onClick={importer.downloadTemplate}
              sx={{
                color: 'var(--accent-dark)',
                textDecoration: 'none',
                cursor: 'pointer',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                verticalAlign: 'baseline',
                lineHeight: 'inherit',
                border: 'none',
                background: 'none',
                padding: 0,
              }}
            >
              {t('tr_territoryImportDownloadTemplate')}
            </Link>
            {t('tr_territoryImportIntro_after')}
          </>
        ) : undefined
      }
      actions={
        <Stack spacing="var(--dialog-header-gap)">
          {result && (
            <Button
              variant="main"
              disabled={
                saving || !!error || !!result.missing.length || !importer.editor
              }
              onClick={importer.handleImport}
              endIcon={
                saving ? (
                  <WaitingLoader size={20} variant="standard" />
                ) : undefined
              }
            >
              {t('tr_import')}
            </Button>
          )}
          <Button
            variant="secondary"
            disabled={saving}
            onClick={
              importer.files.length && !processing
                ? importer.chooseAgain
                : onClose
            }
          >
            {t(importer.files.length && !processing ? 'tr_back' : 'tr_cancel')}
          </Button>
        </Stack>
      }
    >
      <Stack spacing="var(--dialog-gap-mobile)" sx={{ width: '100%' }}>
        {error && (
          <Box role="alert">
            <Typography color="var(--red-main)">{error}</Typography>
          </Box>
        )}
        {!result && !processing && !importer.files.length && (
          <>
            <Accordion
              id="territory-import-tips"
              label={t('tr_templateFillingTips')}
              expanded={importer.tipsExpanded}
              onChange={importer.toggleTips}
              summaryProps={{
                'aria-controls': 'territory-import-tips-content',
              }}
              sx={{
                backgroundColor: 'var(--grey-50)',
                borderRadius: 'var(--radius-s)',
              }}
            >
              <Stack
                id="territory-import-tips-content"
                spacing="var(--dialog-header-gap)"
              >
                {[
                  'tr_territoryImportTemplateHelp',
                  'tr_territoryImportTypeHelp',
                  'tr_territoryImportMapHelp',
                  'tr_territoryImportFilesHelp',
                ].map((key) => (
                  <Typography
                    key={key}
                    className="body-small-regular"
                    color="var(--grey-400)"
                  >
                    {t(key)}
                  </Typography>
                ))}
              </Stack>
            </Accordion>
            <Box
              {...importer.getRootProps({
                role: 'button',
                'aria-label': t('tr_territoryImportChooseFiles'),
              })}
              sx={{
                border: '1px dashed var(--accent-dark)',
                borderRadius: 'var(--radius-m)',
                minHeight: '160px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 'var(--dialog-gap-mobile)',
                '&:hover': { backgroundColor: 'var(--accent-100)' },
                '&:focus-visible': {
                  outline: '2px solid var(--accent-dark)',
                  outlineOffset: '2px',
                },
              }}
            >
              <input
                {...importer.getInputProps()}
                aria-label={t('tr_territoryImportChooseFiles')}
              />
              <Stack
                spacing="var(--dialog-header-gap)"
                sx={{ alignItems: 'center' }}
              >
                <Stack
                  direction="row"
                  spacing="var(--dialog-header-gap)"
                  sx={{ alignItems: 'center' }}
                >
                  <IconImportFile color="var(--accent-dark)" />
                  <Typography
                    className="button-caps"
                    color="var(--accent-dark)"
                  >
                    {t('tr_dragOrClick')}
                  </Typography>
                </Stack>
                <Typography
                  className="label-small-regular"
                  color="var(--accent-400)"
                  sx={{ textAlign: 'center' }}
                >
                  {t('tr_territoryImportFormats')}
                </Typography>
              </Stack>
            </Box>
          </>
        )}
        {processing && (
          <Box role="status" aria-label={t('tr_territoryImportReading')}>
            <WaitingLoader variant="standard" size={60} />
          </Box>
        )}
        {result && (
          <>
            <Stack
              spacing="var(--dialog-gap-mobile)"
              divider={<CustomDivider color="var(--accent-200)" />}
              sx={{
                padding: 'var(--dialog-gap-mobile)',
                borderRadius: 'var(--radius-m)',
                bgcolor: 'var(--accent-150)',
              }}
            >
              <Stack
                direction="row"
                spacing="var(--dialog-header-gap)"
                sx={{ alignItems: 'center' }}
              >
                <IconImportFile color="var(--accent-dark)" />
                <Typography
                  className="h4"
                  color="var(--accent-dark)"
                  sx={{ overflowWrap: 'anywhere', minWidth: 0 }}
                >
                  {importer.files.map((file) => file.name).join(', ')}
                </Typography>
              </Stack>
              <Stack
                spacing="var(--dialog-header-gap)"
                role="status"
                aria-live="polite"
              >
                {counts.map(([key, count]) => (
                  <Stack
                    key={key}
                    direction="row"
                    sx={{
                      justifyContent: 'space-between',
                      gap: 'var(--dialog-gap-mobile)',
                    }}
                  >
                    <Typography>{t(key)}</Typography>
                    <Typography className="body-small-semibold">
                      {count}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
              <Stack spacing="var(--dialog-header-gap)">
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
            </Stack>
            {!!result.updated && (
              <InfoNote message={t('tr_territoryImportPreserveData')} />
            )}
            {!!result.updated && !!result.boundaries && (
              <InfoNote message={t('tr_territoryImportReplaceMaps')} />
            )}
            {result.notices.map((notice, index) => (
              <InfoNote
                key={`${notice.key}-${index}`}
                message={t(notice.key, notice.values)}
              />
            ))}
            {!!importer.publisherNames.length && (
              <Typography className="body-small-semibold">
                {t('tr_territoryImportMatchPublishers')}
              </Typography>
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
          </>
        )}
        {importer.showDateOrder && (
          <Select
            label={t('tr_territoryImportDateOrder')}
            value={importer.dateOrder}
            disabled={saving || processing}
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
        )}
      </Stack>
    </Dialog>
  );
};
export default TerritoryImport;
