import { Stack } from '@mui/material';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';

const TerritoryNote = ({
  kind,
  value,
}: {
  kind: 'territory' | 'assignment';
  value?: string;
}) => {
  const { t } = useAppTranslation();
  if (!value?.trim()) return null;
  return (
    <Stack spacing={0.5} sx={{ minWidth: 0 }}>
      <Typography className="body-small-semibold" color="var(--grey-400)">
        {t(
          kind === 'territory'
            ? 'tr_territoryNotes'
            : 'tr_territoryAssignmentNotes'
        )}
      </Typography>
      <Typography
        className="body-small-regular"
        color="var(--black)"
        sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
      >
        {value}
      </Typography>
    </Stack>
  );
};
export default TerritoryNote;
