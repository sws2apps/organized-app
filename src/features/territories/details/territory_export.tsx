import { ReactNode, useState } from 'react';
import { Box, FormControlLabel, RadioGroup, Stack } from '@mui/material';
import {
  Button,
  Checkbox,
  CustomDivider,
  InfoNote,
  Typography,
} from '@components/index';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import Radio from '@components/radio';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import IconLoading from '@components/icon_loading';
import { Territory } from '@definition/territory';
import PdfPreview from '@features/territories/details/pdf_preview';
import useTerritoryExport, {
  ExportFormat,
} from '@features/territories/details/useTerritoryExport';

type Format = { id: ExportFormat; name: string };

const MAP_FORMATS: Format[] = [
  { id: 's12', name: 'tr_territoryS122' },
  { id: 's12a4', name: 'tr_territoryS12OnA4' },
  { id: 'a5h', name: 'tr_territoryA5HorizontalOnA4' },
  { id: 'a5v', name: 'tr_territoryA5VerticalOnA4' },
];

// a phone territory has no map, so the A5 layouts built around one don't apply
const PHONE_FORMATS: Format[] = [
  { id: 's12', name: 'tr_territoryS12PhoneCard' },
  { id: 's12a4', name: 'tr_territoryS12PhoneCardOnA4' },
];

const OptionGroup = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <Stack spacing="8px">
    <Typography className="body-small-semibold" color="var(--grey-400)">
      {label}
    </Typography>
    {children}
  </Stack>
);

const TerritoryExport = ({
  territory,
  onClose,
}: {
  territory: Territory;
  onClose: VoidFunction;
}) => {
  const { t } = useAppTranslation();

  const exporter = useTerritoryExport(territory);
  const [renderedUrl, setRenderedUrl] = useState<string>();
  const loadingPreview =
    exporter.isProcessing ||
    (!!exporter.previewUrl && renderedUrl !== exporter.previewUrl);

  const { tablet600Up } = useBreakpoints();

  const { parts, isPhone } = exporter;

  const formats = isPhone ? PHONE_FORMATS : MAP_FORMATS;

  const handleExport = async () => {
    if (await exporter.handleExport()) onClose();
  };

  return (
    <Dialog
      onClose={onClose}
      open
      title={t('tr_territoryExportTerritory', { number: territory.number })}
      description={t('tr_territoryChooseExportFormat')}
    >
      <Stack
        direction={tablet600Up ? 'row' : 'column'}
        spacing="24px"
        divider={
          tablet600Up && (
            <CustomDivider
              orientation="vertical"
              flexItem
              color="var(--accent-200)"
            />
          )
        }
        sx={{ width: '100%', '& > .MuiStack-root': { flex: 1, minWidth: 0 } }}
      >
        <OptionGroup label={t('tr_territoryFormat')}>
          <RadioGroup
            value={exporter.format}
            onChange={(event) =>
              exporter.setFormat(event.target.value as ExportFormat)
            }
            sx={{ gap: '8px', marginLeft: '6px' }}
          >
            {formats.map((item) => (
              <FormControlLabel
                key={item.id}
                value={item.id}
                control={<Radio />}
                label={<Typography>{t(item.name)}</Typography>}
              />
            ))}
          </RadioGroup>
        </OptionGroup>

        <OptionGroup label={t('tr_territoryInclude')}>
          <Checkbox
            label={
              isPhone ? t('tr_territoryPhoneNumbers') : t('tr_territoryMap')
            }
            checked={parts.front}
            disabled={parts.front && !parts.back}
            onChange={() => exporter.toggleSide('front')}
            className="body-regular"
          />
          <Checkbox
            label={t('tr_territoryDoNotCallLabel')}
            checked={parts.back}
            disabled={parts.back && !parts.front}
            onChange={() => exporter.toggleSide('back')}
            className="body-regular"
          />
          {!isPhone && parts.front && (
            <Checkbox
              label={t('tr_territoryHouseholds')}
              checked={exporter.showHouseholds}
              onChange={(_, checked) => exporter.setShowHouseholds(checked)}
              className="body-regular"
            />
          )}
        </OptionGroup>
      </Stack>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          // as tall as the pages, scrolling once they pass 380px
          minHeight: '160px',
          maxHeight: '380px',
          display: 'flex',
          flexDirection: 'column',
          // the dialog scrolls instead of squeezing the preview on short screens
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <PdfPreview url={exporter.previewUrl} onSettled={setRenderedUrl} />

        {loadingPreview && (
          <Stack
            sx={{
              position: 'absolute',
              inset: 0,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--white-semi-l)',
            }}
          >
            <Stack
              role="status"
              aria-live="polite"
              direction="row"
              sx={{
                alignItems: 'center',
                gap: 'var(--radius-l)',
                margin: 'var(--radius-l)',
                padding: 'var(--radius-xl)',
                borderRadius: 'var(--radius-l)',
                backgroundColor: 'var(--white)',
                boxShadow: 'var(--small-card-shadow)',
              }}
            >
              <Box aria-hidden="true">
                <IconLoading color="var(--accent-main)" />
              </Box>
              <Typography className="body-small-regular" color="var(--black)">
                {t('tr_territoryPreparingThePreview')}
              </Typography>
            </Stack>
          </Stack>
        )}
      </Box>

      <InfoNote
        message={t(
          exporter.format === 's12'
            ? 'tr_territoryPrintCardStockHelp'
            : 'tr_territoryPrintA4Help'
        )}
      />

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button
          variant="main"
          disabled={
            exporter.isProcessing ||
            exporter.isExporting ||
            !exporter.previewUrl
          }
          endIcon={
            exporter.isProcessing || exporter.isExporting ? (
              <IconLoading width={20} height={20} color="currentColor" />
            ) : undefined
          }
          onClick={handleExport}
        >
          {t('tr_export')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TerritoryExport;
