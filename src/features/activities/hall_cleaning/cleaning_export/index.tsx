import type { CleaningExportPeriod } from '@definition/hall_cleaning_export';
import { useState } from 'react';
import { Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { CleaningExportProps } from '@features/activities/hall_cleaning/cleaning_export/index.types';
import useCleaningExport from '@features/activities/hall_cleaning/cleaning_export/useCleaningExport';
import CleaningLayoutPreview from '@features/activities/hall_cleaning/cleaning_export/layout_preview';
import Button from '@components/button';
import Checkbox from '@components/checkbox';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import IconLoading from '@components/icon_loading';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Tabs from '@components/tabs';
import InfoNote from '@components/info_note';
import Typography from '@components/typography';
import WeekRangeSelector from '@features/meetings/week_range_selector';

const CleaningExport = ({ open, onClose }: CleaningExportProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { t } = useAppTranslation();
  const { tablet500Down } = useBreakpoints();
  const model = useCleaningExport(onClose);
  const {
    isProcessing,
    versionAvailable,
    turnsAvailable,
    exportDetailed,
    exportRotation,
  } = model;
  const cleaningLabel = t('tr_cleaningDetailedSchedule');
  const rotationLabel = t('tr_cleaningRotationSchedule');
  const rotationControls = (
    <Stack spacing="16px">
      <Stack direction={tablet500Down ? 'column' : 'row'} spacing="8px">
        <Select
          label={t('tr_cleaningExportPeriod')}
          inputProps={{ 'aria-label': t('tr_cleaningExportPeriod') }}
          value={model.rotationPeriod}
          sx={{ flex: 1, minWidth: 0 }}
          onChange={(e) =>
            model.setRotationPeriod(e.target.value as CleaningExportPeriod)
          }
        >
          <MenuItem value="year">
            <Typography>{t('tr_cleaningCalendarYear')}</Typography>
          </MenuItem>
          <MenuItem value="service_year">
            <Typography>{t('tr_serviceYear')}</Typography>
          </MenuItem>
          <MenuItem value="custom">
            <Typography>{t('tr_custom')}</Typography>
          </MenuItem>
        </Select>
        {model.rotationPeriod !== 'custom' && (
          <Select
            label={t('tr_cleaningExportYear')}
            inputProps={{ 'aria-label': t('tr_cleaningExportYear') }}
            value={model.rotationYear}
            sx={{ flex: 1, minWidth: 0 }}
            onChange={(e) => model.setRotationYear(Number(e.target.value))}
          >
            {model.years.map((year) => (
              <MenuItem key={year} value={year}>
                <Typography>{model.rotationYearLabel(year)}</Typography>
              </MenuItem>
            ))}
          </Select>
        )}
      </Stack>
      {model.rotationPeriod === 'custom' && (
        <WeekRangeSelector
          meeting="cleaning"
          startWeek={model.rotationStart}
          endWeek={model.rotationEnd}
          onStartChange={model.handleRotationStart}
          onEndChange={model.handleRotationEnd}
        />
      )}
    </Stack>
  );
  return (
    <Dialog
      disableEnforceFocus={previewOpen}
      onClose={onClose}
      open={open}
      title={t('tr_exportHallCleaning')}
      description={t('tr_exportHallCleaningDesc')}
    >
      <Stack spacing="24px" sx={{ width: '100%' }}>
        <WeekRangeSelector
          disabled={!exportDetailed || isProcessing}
          meeting="cleaning"
          startWeek={model.startWeek}
          endWeek={model.endWeek}
          onStartChange={model.handleSetStartWeek}
          onEndChange={model.handleSetEndWeek}
        />
        <Stack spacing="8px">
          <Checkbox
            label={cleaningLabel}
            checked={exportDetailed}
            disabled={isProcessing}
            onChange={(_, checked) => model.setExportDetailed(checked)}
          />
          <Checkbox
            label={rotationLabel}
            checked={exportRotation}
            disabled={isProcessing}
            onChange={(_, checked) => model.setExportRotation(checked)}
          />
        </Stack>
        {exportRotation && rotationControls}
        {model.isLoading && <IconLoading />}
        {!versionAvailable && !model.isLoading && (
          <InfoNote message={t('tr_scheduleStatusUnavailableDesc')} />
        )}
        <Tabs
          tabs={[
            {
              label: t('tr_cleaningTemplateTab'),
              Component: (
                <CleaningLayoutPreview
                  layouts={[
                    { value: 'list', label: t('tr_hallCleaningLayoutList') },
                    { value: 'cards', label: t('tr_hallCleaningLayoutCards') },
                    { value: 'turns', label: t('tr_cleaningRotationTable') },
                  ]}
                  value={model.layout}
                  onChange={model.handleSetLayout}
                  onPreviewChange={setPreviewOpen}
                />
              ),
            },
            {
              label: t('tr_rotationTemplateTab'),
              Component: (
                <Stack spacing="24px">
                  <CleaningLayoutPreview
                    layouts={[
                      {
                        value: 'rotation',
                        label: t('tr_hallCleaningLayoutList'),
                      },
                    ]}
                    value="rotation"
                    onChange={() => undefined}
                    onPreviewChange={setPreviewOpen}
                  />
                  {versionAvailable && !turnsAvailable && (
                    <InfoNote message={t('tr_cleaningNoGroupTurns')} />
                  )}
                </Stack>
              ),
            },
          ]}
        />
      </Stack>
      <DialogActions>
        <Button variant="secondary" disabled={isProcessing} onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button
          variant="main"
          onClick={model.handleExport}
          disabled={isProcessing || !model.canExport}
          endIcon={isProcessing ? <IconLoading /> : undefined}
        >
          {t('tr_export')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default CleaningExport;
