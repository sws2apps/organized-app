import { ReactNode } from 'react';
import { Box, FormControlLabel, RadioGroup, Stack } from '@mui/material';
import { Button, Checkbox, CustomDivider, Typography } from '@components/index';
import { useBreakpoints } from '@hooks/index';
import Radio from '@components/radio';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import IconLoading from '@components/icon_loading';
import { Territory } from '@definition/territory';
import PdfPreview from './pdf_preview';
import useTerritoryExport, { ExportFormat } from './useTerritoryExport';

type Format = { id: ExportFormat; name: string };

const MAP_FORMATS: Format[] = [
  { id: 's12', name: 'S-12' },
  { id: 's12a4', name: 'S-12 on A4' },
  { id: 'a5h', name: 'A5 horizontal' },
  { id: 'a5v', name: 'A5 vertical' },
];

// a phone territory has no map, so the A5 layouts built around one don't apply
const PHONE_FORMATS: Format[] = [
  { id: 's12', name: 'S-12 phone card' },
  { id: 's12a4', name: 'S-12 phone card on A4' },
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
  const exporter = useTerritoryExport(territory);

  const { tablet600Up } = useBreakpoints();

  const { parts, isPhone } = exporter;

  const formats = isPhone ? PHONE_FORMATS : MAP_FORMATS;

  // the QR code sits on the back, and on the A5 vertical page under the map
  const qrShown = parts.back || (exporter.format === 'a5v' && parts.front);

  const handleExport = () => {
    exporter.handleExport();
    onClose();
  };

  return (
    <Dialog
      onClose={onClose}
      open
      title={`Export territory ${territory.number}`}
      description="Choose what to include and the format. The PDF is saved to your device."
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
        <OptionGroup label="Include">
          <Checkbox
            label={isPhone ? 'Phone numbers card' : 'Territory map card'}
            checked={parts.front}
            disabled={parts.front && !parts.back}
            onChange={() => exporter.toggleSide('front')}
            className="body-regular"
          />
          <Checkbox
            label="Back side with do not calls"
            checked={parts.back}
            disabled={parts.back && !parts.front}
            onChange={() => exporter.toggleSide('back')}
            className="body-regular"
          />
          {qrShown && (
            <Checkbox
              label="QR code"
              checked={exporter.showQr}
              onChange={(_, checked) => exporter.setShowQr(checked)}
              className="body-regular"
            />
          )}
        </OptionGroup>

        <OptionGroup label="Format">
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
                label={<Typography>{item.name}</Typography>}
              />
            ))}
          </RadioGroup>
        </OptionGroup>
      </Stack>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '380px',
          overflow: 'hidden',
          borderRadius: 'var(--radius-l)',
          border: '1px solid var(--accent-200)',
          backgroundColor: 'var(--grey-100)',
        }}
      >
        <PdfPreview url={exporter.previewUrl} />

        {exporter.isProcessing && (
          <Stack
            sx={{
              position: 'absolute',
              inset: 0,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--white-semi-l)',
            }}
          >
            <Typography className="body-small-regular" color="var(--grey-400)">
              Preparing the preview…
            </Typography>
          </Stack>
        )}
      </Box>

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="main"
          disabled={exporter.isProcessing}
          endIcon={exporter.isProcessing ? <IconLoading /> : undefined}
          onClick={handleExport}
        >
          Export
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TerritoryExport;
