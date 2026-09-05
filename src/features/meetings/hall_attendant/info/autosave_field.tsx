import { useEffect, useRef, useState } from 'react';
import TextField from '@components/textfield';
import { TextFieldTypeProps } from '@components/textfield/index.types';

const AutosaveField = ({
  value,
  onSave,
  onBlur,
  onFocus,
  ...props
}: TextFieldTypeProps & {
  onSave: (value: string) => Promise<boolean>;
}) => {
  const [draft, setDraft] = useState(value);
  const focused = useRef(false);
  const saved = useRef(value);
  const revision = useRef(0);
  const pending = useRef(false);
  useEffect(() => {
    saved.current = value;
    if (!focused.current && !pending.current) setDraft(value);
  }, [value]);
  return (
    <TextField
      {...props}
      value={draft}
      onFocus={(event) => {
        focused.current = true;
        onFocus?.(event);
      }}
      onBlur={(event) => {
        focused.current = false;
        if (!pending.current) setDraft(saved.current);
        onBlur?.(event);
      }}
      onChange={async (event) => {
        const currentRevision = ++revision.current;
        pending.current = true;
        setDraft(event.target.value);
        const success = await onSave(event.target.value);
        if (currentRevision !== revision.current) return;
        pending.current = false;
        if (!success || !focused.current) setDraft(saved.current);
      }}
    />
  );
};
export default AutosaveField;
