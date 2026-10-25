import { useAppTranslation } from '@hooks/index';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, FormControlLabel, RadioGroup, Stack } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useSetAtom } from 'jotai';
import { Button, InfoNote, Radio, Typography } from '@components/index';
import Dialog from '@components/dialog';
import WaitingLoader from '@components/waiting_loader';
import { IconImportFile } from '@icons/index';
import { getMessageByCode } from '@services/i18n/translation';
import { displaySnackNotification } from '@services/states/app';
import useTerritoryAccess from '@features/territories/useTerritoryAccess';
import { territoryNumberKey } from '@utils/territory';
import { territoriesState } from '@states/territories';
import {
  parseServiceTerritory,
  ServiceTerritoryImport,
} from '@features/territories/import/parse_service_territory';

type Mode = 'merge' | 'replace';

const numberKey = territoryNumberKey;

const Summary = ({ result }: { result: ServiceTerritoryImport }) => {
  const { t } = useAppTranslation();

  const lines = [
    [t('tr_territories'), result.territories.length],
    [t('tr_assignments'), result.assignments],
    [
      t('tr_territoryOutRightNow'),
      result.territories.filter((territory) => territory.holder).length,
    ],
    [t('tr_territoryDoNotCallLabel'), result.doNotCalls],
    [t('tr_territoryPublishersNamed'), result.publishers],
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
  const { t } = useAppTranslation();

  const { editor } = useTerritoryAccess();
  const operation = useRef(0);
  useEffect(
    () => () => {
      operation.current++;
    },
    [open]
  );
  const setTerritories = useSetAtom(territoriesState);

  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ServiceTerritoryImport>();
  const [mode, setMode] = useState<Mode>('merge');

  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files.at(0);
      if (!file || !editor) return;
      const current = ++operation.current;

      try {
        setProcessing(true);
        setResult(undefined);
        const parsed = await parseServiceTerritory(await file.arrayBuffer());
        if (current === operation.current) setResult(parsed);
      } catch (error) {
        if (current !== operation.current) return;
        displaySnackNotification({
          severity: 'error',
          header: getMessageByCode('error_app_generic-title'),
          message:
            error instanceof Error
              ? error.message
              : t('tr_territoryTheTerritoryBackupCouldNotBeImportedCheckThe'),
        });
      } finally {
        if (current === operation.current) setProcessing(false);
      }
    },
    [t, editor]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/octet-stream': ['.bkt', '.db', '.sqlite'] },
    maxFiles: 1,
    multiple: false,
  });

  const handleImport = () => {
    if (!result || processing || !editor) return;

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
          notes: territory.notes,
          warning: territory.warning,
          phoneNumbers: territory.phoneNumbers,
          boundaryStyle: territory.boundaryStyle,
          boundary: territory.boundary,
          mapShapes: territory.mapShapes,
          mapLines: territory.mapLines,
          mapMarkers: territory.mapMarkers,
        };
      });

      return [...kept, ...incoming.values()];
    });

    displaySnackNotification({
      severity: 'success',
      header: t('tr_territoryTerritoriesImported'),
      message: t('tr_territoryTerritoriesWithAssignments', {
        length: result.territories.length,
        assignments: result.assignments,
      }),
    });

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('tr_territoryImportTerritories')}
      description={t(
        'tr_territoryBringTerritoriesTheirAssignmentHistoryAndDoNotCall'
      )}
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
                {t('tr_territoryDragOrClickToChoose')}
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
                    t('tr_territoryMapsAreGoogleDriveLinksAndWereNotImported', {
                      driveMaps: result.driveMaps,
                    }),
                  result.skippedDisabled > 0 &&
                    t('tr_territoryDisabledTerritoriesWereSkipped', {
                      skippedDisabled: result.skippedDisabled,
                    }),
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
                    {t(
                      'tr_territoryUpdateTerritoriesWithTheSameNumberAddTheRest'
                    )}
                  </Typography>
                }
              />
              <FormControlLabel
                value="replace"
                control={<Radio />}
                label={
                  <Typography className="body-regular">
                    {t('tr_territoryReplaceAllTerritories')}
                  </Typography>
                }
              />
            </RadioGroup>
          </>
        )}

        <Stack spacing="8px">
          {result && (
            <Button variant="main" onClick={handleImport}>
              {t('tr_import')}
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            {t('tr_cancel')}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default TerritoryImport;
