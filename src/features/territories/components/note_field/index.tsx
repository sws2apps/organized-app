import TextField from '@components/textfield';
import { MAX_NOTE_LENGTH } from '@definition/territory';
import { useAppTranslation } from '@hooks/index';

const TerritoryNoteField = ({
  kind,
  value,
  onChange,
}: {
  kind: 'territory' | 'assignment';
  value: string;
  onChange: (value: string) => void;
}) => {
  const { t } = useAppTranslation();
  return (
    <TextField
      label={t(
        kind === 'territory'
          ? 'tr_territoryNotes'
          : 'tr_territoryAssignmentNotes'
      )}
      helperText={t(
        kind === 'territory'
          ? 'tr_territoryNotesHelp'
          : 'tr_territoryAssignmentNotesHelp'
      )}
      multiline
      minRows={2}
      value={value}
      slotProps={{ htmlInput: { maxLength: MAX_NOTE_LENGTH } }}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};
export default TerritoryNoteField;
