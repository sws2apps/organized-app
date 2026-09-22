import { useCallback, useState } from 'react';
import { Box, FormControlLabel, RadioGroup, Stack } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useSetAtom } from 'jotai';
import { Button, InfoNote, Radio, Typography } from '@components/index';
import Dialog from '@components/dialog';
import WaitingLoader from '@components/waiting_loader';
import { IconImportFile } from '@icons/index';
import { getMessageByCode } from '@services/i18n/translation';
import { displaySnackNotification } from '@services/states/app';
import { territoriesState } from '@states/territories';
import {
  parseServiceTerritory,
  ServiceTerritoryImport,
} from './parse_service_territory';

type Mode = 'merge' | 'replace';

const numberKey = (value: string) => value.trim().toLowerCase();

const Summary = ({ result }: { result: ServiceTerritoryImport }) => {
  const lines = [
    ['Territories', result.territories.length],
    ['Assignments', result.assignments],
    [
      'Out right now',
      result.territories.filter((territory) => territory.holder).length,
    ],
    ['Do-not-call addresses', result.doNotCalls],
    ['Publishers named', result.publishers],
  ] as const;

  return (
    <Stack
      sx={{
        padding: '12px 16px',
        borderRadius: 'var(--radius-l)',
        backgroundColor: 'var(--accent-150)',
        gap: '6px',
      }}
    >
      {lines.map(([label, value]) => (
        <Stack
          key={label}
          direction="row"
          sx={{ justifyContent: 'space-between' }}
        >
          <Typography className="body-small-regular" color="var(--grey-400)">
            {label}
          </Typography>
          <Typography className="body-small-semibold">{value}</Typography>
        </Stack>
      ))}
    </Stack>
  );
};

const TerritoryImport = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: VoidFunction;
}) => {
  const setTerritories = useSetAtom(territoriesState);

  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ServiceTerritoryImport>();
  const [mode, setMode] = useState<Mode>('merge');

  const onDrop = useCallback(async (files: File[]) => {
    const file = files.at(0);
    if (!file) return;

    try {
      setProcessing(true);
      setResult(await parseServiceTerritory(await file.arrayBuffer()));
    } catch (error) {
      displaySnackNotification({
        severity: 'error',
        header: getMessageByCode('error_app_generic-title'),
        message: (error as Error).message,
      });
    } finally {
      setProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/octet-stream': ['.bkt', '.db', '.sqlite'] },
    maxFiles: 1,
    multiple: false,
  });

  const handleImport = () => {
    if (!result) return;

    setTerritories((current) => {
      if (mode === 'replace') return result.territories;

      const incoming = new Map(
        result.territories.map((territory) => [
          numberKey(territory.number),
          territory,
        ])
      );

      const kept = current.map((territory) => {
        const match = incoming.get(numberKey(territory.number));
        if (!match) return territory;

        incoming.delete(numberKey(territory.number));

        // keep what only Organized knows: categories and the drawn map
        return {
          ...match,
          id: territory.id,
          categories: territory.categories,
          boundary: territory.boundary,
          mapShapes: territory.mapShapes,
          mapLines: territory.mapLines,
          mapMarkers: territory.mapMarkers,
          mapSource: territory.mapSource,
          mapPicture: territory.mapPicture,
        };
      });

      return [...kept, ...incoming.values()];
    });

    displaySnackNotification({
      severity: 'success',
      header: 'Territories imported',
      message: `${result.territories.length} territories with ${result.assignments} assignments.`,
    });

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Import territories"
      description="Bring territories, their assignment history and do-not-call addresses over from a Service Territory backup (.bkt)."
    >
      <Stack spacing="16px" sx={{ width: '100%' }}>
        {processing && <WaitingLoader variant="standard" size={60} />}

        {!processing && !result && (
          <Box
            {...getRootProps()}
            sx={{
              border: '1px dashed var(--accent-dark)',
              borderRadius: 'var(--radius-l)',
              height: '160px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'var(--accent-100)' },
            }}
          >
            <input {...getInputProps()} />
            <Stack direction="row" spacing="8px" sx={{ alignItems: 'center' }}>
              <IconImportFile color="var(--accent-dark)" />
              <Typography className="button-caps" color="var(--accent-dark)">
                Drag or click to choose
              </Typography>
            </Stack>
            <Typography
              className="label-small-regular"
              color="var(--accent-400)"
            >
              ServiceTerritory.bkt
            </Typography>
          </Box>
        )}

        {!processing && result && (
          <>
            <Summary result={result} />

            {(result.driveMaps > 0 || result.skippedDisabled > 0) && (
              <InfoNote
                message={[
                  result.driveMaps > 0 &&
                    `${result.driveMaps} maps are Google Drive links and were not imported; draw the borders on the map instead.`,
                  result.skippedDisabled > 0 &&
                    `${result.skippedDisabled} disabled territories were skipped.`,
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            )}

            <RadioGroup
              value={mode}
              onChange={(event) => setMode(event.target.value as Mode)}
            >
              <FormControlLabel
                value="merge"
                control={<Radio />}
                label={
                  <Typography className="body-regular">
                    Update territories with the same number, add the rest
                  </Typography>
                }
              />
              <FormControlLabel
                value="replace"
                control={<Radio />}
                label={
                  <Typography className="body-regular">
                    Replace all territories
                  </Typography>
                }
              />
            </RadioGroup>
          </>
        )}

        <Stack spacing="8px">
          {result && (
            <Button variant="main" onClick={handleImport}>
              Import
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default TerritoryImport;
