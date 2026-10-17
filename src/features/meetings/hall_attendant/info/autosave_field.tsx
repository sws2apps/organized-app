import { useCallback, useEffect } from 'react';
import { useAtomValue, useStore } from 'jotai';
import TextField from '@components/textfield';
import { TextFieldTypeProps } from '@components/textfield/index.types';
import { AutosaveDraft } from '@definition/autosave';
import { userDataViewState } from '@states/settings';
import useAutosaveDrafts from '@hooks/useAutosaveDrafts';

const AutosaveField = ({
  value,
  draftKey,
  onSave,
  onBlur,
  ...props
}: TextFieldTypeProps & {
  draftKey: string;
  onSave: (value: string) => Promise<boolean>;
}) => {
  const store = useStore();
  const view = useAtomValue(userDataViewState);
  const { drafts, getDrafts, updateDrafts, isCurrentScope } = useAutosaveDrafts(
    JSON.stringify(['hall-info', view, draftKey])
  );
  const draft = drafts.text;
  useEffect(() => {
    updateDrafts((current) => {
      if (current.text?.status === 'saved' && current.text.value === value)
        return {};
      return current;
    });
  }, [draft, value, updateDrafts]);

  const save = useCallback(
    async (entry: AutosaveDraft) => {
      const current = getDrafts().text;
      if (
        !isCurrentScope() ||
        store.get(userDataViewState) !== view ||
        current?.revision !== entry.revision ||
        !['pending', 'failed'].includes(current.status)
      )
        return;
      const setStatus = (status: AutosaveDraft['status']) =>
        updateDrafts((current) =>
          current.text?.revision === entry.revision
            ? { text: { ...current.text, status } }
            : current
        );
      setStatus('saving');
      const success = await onSave(entry.value);
      setStatus(success ? 'saved' : 'failed');
    },
    [getDrafts, isCurrentScope, updateDrafts, onSave, store, view]
  );

  return (
    <TextField
      {...props}
      value={draft?.value ?? value}
      error={draft?.status === 'failed' || props.error}
      onBlur={(event) => {
        const current = getDrafts().text;
        if (current?.status === 'failed') void save(current);
        onBlur?.(event);
      }}
      onChange={(event) => {
        const entry: AutosaveDraft = {
          value: event.target.value,
          revision: crypto.randomUUID(),
          status: 'pending',
        };
        updateDrafts(() => ({ text: entry }));
        void save(entry);
      }}
    />
  );
};
export default AutosaveField;
