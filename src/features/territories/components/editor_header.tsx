import { Stack } from '@mui/material';
import { Button, Typography } from '@components/index';
import IconButton from '@components/icon_button';
import Tooltip from '@components/tooltip';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconDelete } from '@icons/index';

// the title and its delete action on one row, the description under both
const EditorHeader = ({
  title,
  description,
  onDelete,
  deleteLabel,
}: {
  title: string;
  description?: string;
  onDelete?: VoidFunction;
  deleteLabel?: string;
}) => {
  const { t } = useAppTranslation();

  const { tablet600Up } = useBreakpoints();

  const icon = <IconDelete color="var(--red-main)" />;

  return (
    // the dialog sizes its heading to the content, so this asks for the full row
    <Stack spacing="2px" sx={{ width: '100vw', maxWidth: '100%' }}>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <Typography component="h2" className="h2" sx={{ minWidth: 0 }}>
          {title}
        </Typography>

        {onDelete &&
          (tablet600Up ? (
            <Button
              variant="small"
              color="red"
              disableAutoStretch
              startIcon={icon}
              onClick={onDelete}
              sx={{ minHeight: '32px', minWidth: 'unset', flexShrink: 0 }}
            >
              {deleteLabel ?? t('tr_delete')}
            </Button>
          ) : (
            <Tooltip title={deleteLabel ?? t('tr_delete')}>
              <IconButton
                color="error"
                aria-label={deleteLabel ?? t('tr_delete')}
                onClick={onDelete}
                sx={{
                  flexShrink: 0,
                  // pulled into the row's rhythm, and 44px to tap
                  margin: '-4px -4px -4px 0',
                  borderRadius: 'var(--radius-m)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: '-2px',
                  },
                }}
              >
                {icon}
              </IconButton>
            </Tooltip>
          ))}
      </Stack>

      {description && (
        <Typography color="var(--grey-400)">{description}</Typography>
      )}
    </Stack>
  );
};

export default EditorHeader;
