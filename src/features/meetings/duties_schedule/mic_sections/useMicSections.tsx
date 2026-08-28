import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { schedulesState } from '@states/schedules';
import { meetingDutiesState } from '@states/settings';
import {
  schedulesDutiesMeetingParts,
  schedulesDutiesSections,
} from '@services/app/schedules';
import {
  DutiesMeetingValue,
  dutiesSectionDelete,
  dutiesSectionsAddSuggested,
  dutiesSectionsCopyFromWeek,
  dutiesSectionsPreviousWeek,
  dutiesSectionsSuggested,
} from '@services/app/duties';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';

const useMicSections = (week: string, meeting: DutiesMeetingValue) => {
  const schedules = useAtomValue(schedulesState);
  const dutiesConfig = useAtomValue(meetingDutiesState);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [editId, setEditId] = useState<string | undefined>();

  // sections belong to the week: schedules drive the refresh after a save
  const sections = useMemo(
    () => schedulesDutiesSections(week, meeting),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [week, meeting, schedules]
  );

  const parts = useMemo(
    () => schedulesDutiesMeetingParts(week, meeting),
    [week, meeting]
  );

  const hasSuggestion = useMemo(
    () => dutiesSectionsSuggested(week, meeting).length > 0,
    [week, meeting]
  );

  const previousWeek = useMemo(
    () => dutiesSectionsPreviousWeek(week, meeting),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [week, meeting, schedules]
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

  const handleCloseDelete = () => setDeleteId('');

  const notifyError = (error: unknown) => {
    console.error(error);

    displaySnackNotification({
      header: getMessageByCode('error_app_generic-title'),
      message: getMessageByCode(
        error instanceof Error ? error.message : String(error)
      ),
      severity: 'error',
    });
  };

  const handleDelete = async () => {
    try {
      await dutiesSectionDelete(week, meeting, deleteId);

      setDeleteId('');
    } catch (error) {
      notifyError(error);
    }
  };

  const handleAddSuggested = async () => {
    try {
      await dutiesSectionsAddSuggested(
        week,
        meeting,
        dutiesConfig?.mic_amount.value || 2
      );
    } catch (error) {
      notifyError(error);
    }
  };

  const handleCopyPrevious = async () => {
    try {
      await dutiesSectionsCopyFromWeek(previousWeek, week, meeting);
    } catch (error) {
      notifyError(error);
    }
  };

  const sectionParts = (keys: string[]) =>
    keys
      .map((key) => parts.find((part) => part.key === key)?.label)
      .filter(Boolean)
      .join(', ');

  return {
    sections,
    sectionParts,
    hasSuggestion,
    previousWeek,
    formOpen,
    editId,
    deleteId,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseForm,
    handleAskDelete,
    handleCloseDelete,
    handleDelete,
    handleAddSuggested,
    handleCopyPrevious,
  };
};

export default useMicSections;
