import { Stack } from '@mui/material';
import { Button, Typography } from '@components/index';
import IconButton from '@components/icon_button';
import Tooltip from '@components/tooltip';
import { useBreakpoints } from '@hooks/index';
import { IconDelete } from '@icons/index';

const EditorHeader = ({
  title,
  description,
  onDelete,
}: {
  title: string;
  description: string;
  onDelete?: VoidFunction;
}) => {
  const { tablet600Up } = useBreakpoints();

  return (
    <Stack
      spacing="4px"
      sx={{
        // the dialog sizes its heading to the content, so this asks for the full row
        width: '100vw',
        maxWidth: '100%',
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <Typography component="h2" className="h2" sx={{ minWidth: 0 }}>
          {title}
        </Typography>

        {onDelete && tablet600Up && (
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

        {onDelete && !tablet600Up && (
          <Tooltip title="Delete">
            <IconButton
              color="error"
              edge={false}
              aria-label="Delete"
              onClick={onDelete}
              sx={{
                flexShrink: 0,
                borderRadius: 'var(--radius-m)',
                padding: '4px',
                margin: '-2px -4px 0 0',
              }}
            >
              <IconDelete color="var(--red-main)" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Typography color="var(--grey-400)">{description}</Typography>
    </Stack>
  );
};

export default EditorHeader;
