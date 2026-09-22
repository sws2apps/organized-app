import { Stack } from '@mui/material';
import { Button, Typography } from '@components/index';
import { IconDelete } from '@icons/index';

const EditorHeader = ({
  title,
  description,
  onDelete,
}: {
  title: string;
  description: string;
  onDelete?: VoidFunction;
}) => (
  <Stack
    direction="row"
    sx={{
      // the dialog sizes its heading to the content, so this asks for the full row
      width: '100vw',
      maxWidth: '100%',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '8px',
    }}
  >
    <Stack spacing="2px" sx={{ minWidth: 0 }}>
      <Typography component="h2" className="h2">
        {title}
      </Typography>
      <Typography color="var(--grey-400)">{description}</Typography>
    </Stack>

    {onDelete && (
      <Button
        variant="small"
        color="red"
        disableAutoStretch
        startIcon={<IconDelete color="var(--red-main)" />}
        onClick={onDelete}
        sx={{ minHeight: '32px', minWidth: 'unset', flexShrink: 0 }}
      >
        Delete
      </Button>
    )}
  </Stack>
);

export default EditorHeader;
