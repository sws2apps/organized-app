import { useAppTranslation } from '@hooks/index';
import { useMemo, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { sourcesState } from '@states/sources';
import {
  JWLangState,
  userDataViewState,
  settingsState,
} from '@states/settings';
import { schedulesState } from '@states/schedules';
import {
  schedulesDutiesMeetingParts,
  schedulesDutiesSections,
} from '@services/app/schedules';
import {
  DutiesMeetingValue,
  dutiesSectionDelete,
  dutiesSectionsRestore,
} from '@services/app/duties';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';

const useMicSections = (week: string, meeting: DutiesMeetingValue) => {
  const { t } = useAppTranslation();
  const schedules = useAtomValue(schedulesState);
  const settings = useAtomValue(settingsState);
  const sources = useAtomValue(sourcesState);
  const lang = useAtomValue(JWLangState);
  const dataView = useAtomValue(userDataViewState);

  const [isBusy, setIsBusy] = useState(false);
  const busy = useRef(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [editId, setEditId] = useState<string | undefined>();

  // sections belong to the week: schedules drive the refresh after a save
  const sections = useMemo(
    () => schedulesDutiesSections(week, meeting),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [week, meeting, schedules, dataView, settings, sources, lang]
  );

  const parts = useMemo(
    () => schedulesDutiesMeetingParts(week, meeting),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [week, meeting, schedules, sources, lang, dataView]
  );

  const handleOpenAdd = () => {
    setEditId(undefined);
    setFormOpen(true);
  };

  const handleOpenEdit = (id: string) => {
    setEditId(id);
    setFormOpen(true);
  };

  const handleCloseForm = () => setFormOpen(false);

  const handleAskDelete = (id: string) => setDeleteId(id);

  const handleCloseDelete = () => {
    if (!busy.current) setDeleteId('');
  };

  const notifyError = (error: unknown) => {
    console.error(error);

    displaySnackNotification({
      header: getMessageByCode('error_app_generic-title'),
      message: t(error instanceof Error ? error.message : String(error)),
      severity: 'error',
    });
  };

  const run = async (action: () => Promise<void>) => {
    if (busy.current) return;
    busy.current = true;
    setIsBusy(true);
    try {
      await action();
    } catch (error) {
      notifyError(error);
    } finally {
      busy.current = false;
      setIsBusy(false);
    }
  };
  const handleDelete = () =>
    run(async () => {
      await dutiesSectionDelete(week, meeting, deleteId);

      setDeleteId('');
    });
  const sectionParts = (keys: string[]) =>
    keys
      .map((key) => parts.find((part) => part.key === key)?.label)
      .filter(Boolean)
      .join(', ');

  return {
    sections,
    restoreOpen,
    setRestoreOpen,
    handleRestore: () =>
      run(async () => {
        await dutiesSectionsRestore(week, meeting);
        setRestoreOpen(false);
      }),
    isBusy,
    sectionParts,
    formOpen,
    editId,
    deleteId,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseForm,
    handleAskDelete,
    handleCloseDelete,
    handleDelete,
    parts,
  };
};

export default useMicSections;
