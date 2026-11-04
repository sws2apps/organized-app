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
      sx={{ color: 'var(--grey-400)' }}
      label={t(
        kind === 'territory'
          ? 'tr_territoryNotes'
          : 'tr_territoryAssignmentNotes'
      )}
      helperText={kind === 'territory' ? t('tr_territoryNotesHelp') : undefined}
      multiline
      minRows={2}
      value={value}
      slotProps={{ htmlInput: { maxLength: MAX_NOTE_LENGTH } }}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};
export default TerritoryNoteField;
