import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { HallContact, HallNote } from '@definition/hall_attendant';
import { hallInfoState, hallInfoUpdateState } from '@states/hall_attendant';
import { useCurrentUser } from '@hooks/index';

const useHallInfo = () => {
  const info = useAtomValue(hallInfoState);
  const update = useSetAtom(hallInfoUpdateState);
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
  const changeNote = (
    id: string,
    changes: Partial<Pick<HallNote, 'title' | 'text' | '_deleted'>>
  ) =>
    update((row, timestamp) => {
      const item = row.notes.find((note) => note.id === id);
      if (item && !item._deleted)
        Object.assign(item, changes, {
          updatedAt: timestamp,
          revision: crypto.randomUUID(),
        });
    });
  const changeContact = (
    id: string,
    changes: Partial<Pick<HallContact, 'title' | 'phone' | '_deleted'>>
  ) =>
    update((row, timestamp) => {
      const item = row.contacts.find((contact) => contact.id === id);
      if (item && !item._deleted)
        Object.assign(item, changes, {
          updatedAt: timestamp,
          revision: crypto.randomUUID(),
        });
    });
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
