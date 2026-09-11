import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { HallContact, HallNote } from '@definition/hall_attendant';
import {
  hallInfoState,
  hallInfoUpdateState,
  hallInfoDiscardDraftsState,
} from '@states/hall_attendant';
import { useCurrentUser } from '@hooks/index';
import { autosaveScopeState } from '@states/autosave';

const useHallInfo = () => {
  const info = useAtomValue(hallInfoState);
  const scope = useAtomValue(autosaveScopeState);
  const update = useSetAtom(hallInfoUpdateState);
  const discardDrafts = useSetAtom(hallInfoDiscardDraftsState);
  const { canEditHallInfo } = useCurrentUser();
  const [editing, setEditing] = useState(false);
  const [deleteContactId, setDeleteContactId] = useState<string | null>(null);
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const addNote = () =>
    update((row, timestamp) => {
      row.notes.push({
        id: crypto.randomUUID(),
        createdAt: timestamp,
        title: '',
        text: '',
        _deleted: false,
        updatedAt: timestamp,
        revision: crypto.randomUUID(),
      });
    });
  const addContact = () =>
    update((row, timestamp) => {
      row.contacts.push({
        id: crypto.randomUUID(),
        createdAt: timestamp,
        title: '',
        phone: '',
        _deleted: false,
        updatedAt: timestamp,
        revision: crypto.randomUUID(),
      });
    });
  const changeNote = async (
    id: string,
    changes: Partial<Pick<HallNote, 'title' | 'text' | '_deleted'>>
  ) => {
    const success = await update((row, timestamp) => {
      const item = row.notes.find((note) => note.id === id);
      if (item && !item._deleted)
        Object.assign(item, changes, {
          updatedAt: timestamp,
          revision: crypto.randomUUID(),
        });
    });
    if (success && changes._deleted)
      discardDrafts([`note:${id}:title`, `note:${id}:text`], scope, info.type);
    return success;
  };
  const changeContact = async (
    id: string,
    changes: Partial<Pick<HallContact, 'title' | 'phone' | '_deleted'>>
  ) => {
    const success = await update((row, timestamp) => {
      const item = row.contacts.find((contact) => contact.id === id);
      if (item && !item._deleted)
        Object.assign(item, changes, {
          updatedAt: timestamp,
          revision: crypto.randomUUID(),
        });
    });
    if (success && changes._deleted)
      discardDrafts(
        [`contact:${id}:title`, `contact:${id}:phone`],
        scope,
        info.type
      );
    return success;
  };
  const changeInstructions = (value: string) =>
    update((row, timestamp) => {
      row.instructions = {
        text: value,
        updatedAt: timestamp,
        revision: crypto.randomUUID(),
      };
    });
  return {
    deleteNoteId,
    setDeleteNoteId,
    deleteContactId,
    setDeleteContactId,
    info,
    editing: editing && canEditHallInfo,
    canEditHallInfo,
    toggleEditing: () => setEditing((value) => !value),
    addNote,
    addContact,
    changeNote,
    changeContact,
    changeInstructions,
  };
};
export default useHallInfo;
