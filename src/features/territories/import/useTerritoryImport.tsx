import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useDropzone } from 'react-dropzone';
import { saveAs } from 'file-saver';
import { useAppTranslation } from '@hooks/index';
import {
  MAX_TERRITORY_IMPORT_BYTES,
  type TerritoryImportData,
  type TerritoryImportDateOrder,
} from '@definition/territory_import';
import { territoryAssigneesState } from '@features/territories/assignees';
import useTerritoryAccess from '@features/territories/useTerritoryAccess';
import { parseTerritoryFiles } from '@features/territories/import/parse_files';
import { territoriesState } from '@states/territories';
import { displaySnackNotification } from '@services/states/app';
import {
  prepareTerritoryImport,
  TerritoryImportError,
} from '@utils/territory_import';
import { TERRITORY_CSV_TEMPLATE } from '@utils/territory_import_csv';

const useTerritoryImport = (open: boolean, onClose: VoidFunction) => {
  const { t } = useAppTranslation();
  const { editor } = useTerritoryAccess();
  const territories = useAtomValue(territoriesState);
  const assignees = useAtomValue(territoryAssigneesState);
  const setTerritories = useSetAtom(territoriesState);
  const [data, setData] = useState<TerritoryImportData>();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [dateOrder, setDateOrder] = useState<TerritoryImportDateOrder>('iso');
  const [matches, setMatches] = useState<Record<string, string>>({});
  const operation = useRef(0);
  const saveInProgress = useRef(false);
  const cancelOperation = useCallback(() => {
    operation.current++;
  }, []);
  const currentTerritories = useRef(territories);
  currentTerritories.current = territories;
  const errorText = useCallback(
    (error: unknown) =>
      error instanceof TerritoryImportError
        ? t(error.key, error.values)
        : t('tr_territoryImportInvalidFile'),
    [t]
  );
  useEffect(() => {
    setFiles([]);
    setData(undefined);
    setError('');
    setMatches({});
    setProcessing(false);
    return cancelOperation;
  }, [open, cancelOperation]);
  useEffect(() => {
    if (!open || !files.length || !editor) {
      setProcessing(false);
      return;
    }
    const current = ++operation.current;
    setProcessing(true);
    setError('');
    setData(undefined);
    setMatches({});
    parseTerritoryFiles(files, currentTerritories.current, dateOrder)
      .then((result) => {
        if (current === operation.current) setData(result);
      })
      .catch((error) => {
        if (current === operation.current) setError(errorText(error));
      })
      .finally(() => {
        if (current === operation.current) setProcessing(false);
      });
    return cancelOperation;
  }, [open, files, dateOrder, editor, errorText, cancelOperation]);
  const preview = useMemo(() => {
    if (!data) return;
    try {
      return {
        result: prepareTerritoryImport(data, territories, assignees, matches),
      };
    } catch (error) {
      return { error: errorText(error) };
    }
  }, [data, territories, assignees, matches, errorText]);
  const dropzone = useDropzone({
    disabled: saving || !editor,
    accept: {
      'application/octet-stream': ['.bkt', '.db', '.sqlite'],
      'text/csv': ['.csv'],
      'application/json': ['.json', '.geojson'],
      'application/vnd.google-earth.kml+xml': ['.kml'],
    },
    multiple: true,
    maxSize: MAX_TERRITORY_IMPORT_BYTES,
    onDrop: (accepted, rejected) => {
      operation.current++;
      if (rejected.length) {
        setFiles([]);
        setData(undefined);
        setProcessing(false);
        setError(t('tr_territoryImportFileSelectionError'));
      } else setFiles(accepted);
    },
  });
  const handleImport = async () => {
    if (
      !data ||
      !editor ||
      processing ||
      saveInProgress.current ||
      !preview?.result ||
      preview.result.missing.length
    )
      return;
    saveInProgress.current = true;
    setSaving(true);
    setError('');
    try {
      const outcome: unknown = await setTerritories((current) => {
        const prepared = prepareTerritoryImport(
          data,
          current,
          assignees,
          matches
        );
        if (prepared.missing.length)
          throw new TerritoryImportError('tr_territoryImportMatchPublishers');
        return prepared.territories;
      });
      if (outcome === false) {
        setError(t('tr_territorySaveFailed'));
        return;
      }
      displaySnackNotification({
        severity: 'success',
        header: t('tr_territoryTerritoriesImported'),
        message: t('tr_territoryImportSuccess'),
      });
      onClose();
    } catch (error) {
      setError(errorText(error));
    } finally {
      saveInProgress.current = false;
      setSaving(false);
    }
  };
  const downloadTemplate = () =>
    saveAs(
      new Blob([TERRITORY_CSV_TEMPLATE], { type: 'text/csv;charset=utf-8' }),
      'territories-template.csv'
    );
  const chooseAgain = () => {
    operation.current++;
    setFiles([]);
    setData(undefined);
    setMatches({});
    setError('');
  };
  return {
    ...dropzone,
    publisherNames: [
      ...new Set([
        ...(preview?.result?.missing ?? []),
        ...Object.keys(matches),
      ]),
    ],
    editor,
    processing,
    saving,
    error: error || preview?.error,
    result: preview?.result,
    files,
    dateOrder,
    setDateOrder,
    matches,
    setMatches,
    assignees: assignees.filter((person) => !person.group),
    handleImport,
    downloadTemplate,
    chooseAgain,
  };
};
export default useTerritoryImport;
