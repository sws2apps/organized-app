import { Box, Stack } from '@mui/material';
import { Button, Checkbox, TextField, Typography } from '@components/index';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { IconPrint } from '@icons/index';
import { Territory } from '@definition/territory';
import useTerritoryPrint, { PrintTemplate } from './useTerritoryPrint';

const TEMPLATES: { id: PrintTemplate; name: string; hint: string }[] = [
  { id: 's12', name: 'S-12 card', hint: 'The standard size, two per sheet' },
  { id: 'a5', name: 'A5 card', hint: 'Half a sheet, a bigger map' },
];

const TerritoryPrint = ({
  territory,
  onClose,
}: {
  territory: Territory;
  onClose: VoidFunction;
}) => {
  const print = useTerritoryPrint(territory);

  return (
    <Dialog
      onClose={onClose}
      open
      title={`Print ${territory.number}`}
      description="Pick the form, check the preview, then print or save it as PDF."
    >
      <Stack direction="row" spacing="12px" sx={{ width: '100%' }}>
        {TEMPLATES.map((item) => (
          <Box
            key={item.id}
            onClick={() => print.setTemplate(item.id)}
            sx={{
              flex: 1,
              padding: '12px',
              cursor: 'pointer',
              borderRadius: 'var(--radius-l)',
              border: `1px solid ${
                print.template === item.id
                  ? 'var(--accent-main)'
                  : 'var(--accent-200)'
              }`,
              backgroundColor:
                print.template === item.id
                  ? 'var(--accent-150)'
                  : 'transparent',
              transition: 'background-color 0.15s ease',
              '&:hover': { backgroundColor: 'var(--accent-100)' },
            }}
          >
            <Typography className="body-small-semibold" color="var(--black)">
              {item.name}
            </Typography>
            <Typography className="label-small-regular" color="var(--grey-350)">
              {item.hint}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Stack spacing="12px" sx={{ width: '100%' }}>
        <Checkbox
          label="Territory map"
          checked={print.showMap}
          onChange={(_, checked) => print.setShowMap(checked)}
          className="body-regular"
        />

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
