import { ReactNode } from 'react';
import { Box, FormControlLabel, RadioGroup, Stack } from '@mui/material';
import { Button, Checkbox, TextField, Typography } from '@components/index';
import Radio from '@components/radio';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { IconPrint } from '@icons/index';
import { Territory } from '@definition/territory';
import useTerritoryPrint, { PrintTemplate } from './useTerritoryPrint';

const TEMPLATES: { id: PrintTemplate; name: string }[] = [
  { id: 's12', name: 'S-12 card' },
  { id: 'a5', name: 'A5 horizontal' },
  { id: 'a5v', name: 'A5 vertical' },
  { id: 'letter', name: 'US Letter' },
];

// the same label-over-options shape as the field service groups export
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

const TerritoryPrint = ({
  territory,
  onClose,
}: {
  territory: Territory;
  onClose: VoidFunction;
}) => {
  const print = useTerritoryPrint(territory);

  const isPhone = territory.type === 'phone';

  return (
    <Dialog
      onClose={onClose}
      open
      title={`Print ${territory.number}`}
      description="Check the preview, then print or save it as PDF."
    >
      <Stack spacing="24px" sx={{ width: '100%' }}>
        <OptionGroup label="Format">
          <RadioGroup
            value={print.template}
            onChange={(event) =>
              print.setTemplate(event.target.value as PrintTemplate)
            }
            sx={{ gap: '8px', marginLeft: '6px' }}
          >
            {TEMPLATES.map((item) => (
              <FormControlLabel
                key={item.id}
                value={item.id}
                control={<Radio />}
                label={
                  <Typography>
                    {item.id === 's12' && isPhone
                      ? 'S-12 phone card'
                      : item.name}
                  </Typography>
                }
              />
            ))}
          </RadioGroup>
        </OptionGroup>

        <OptionGroup label="Include">
          {!isPhone && (
            <Checkbox
              label="Territory map"
              checked={print.showMap}
              onChange={(_, checked) => print.setShowMap(checked)}
              className="body-regular"
            />
          )}

          <Checkbox
            label="QR code"
            checked={print.showQr}
            onChange={(_, checked) => print.setShowQr(checked)}
            className="body-regular"
          />
        </OptionGroup>

        <TextField
          label="Notes"
          placeholder="Printed in the notes box on the back"
          value={print.notes}
          onChange={(event) => print.setNotes(event.target.value)}
        />
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
        {print.previewUrl && (
          <iframe
            ref={print.frame}
            src={`${print.previewUrl}#toolbar=0&view=FitH`}
            title="Territory card preview"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        )}

        {print.isProcessing && (
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
          variant="secondary"
          disabled={print.isProcessing}
          onClick={print.handleDownload}
        >
          Save PDF
        </Button>
        <Button
          variant="main"
          disabled={print.isProcessing}
          startIcon={<IconPrint color="var(--always-white)" />}
          onClick={print.handlePrint}
        >
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TerritoryPrint;
