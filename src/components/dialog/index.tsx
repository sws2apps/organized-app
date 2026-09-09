import {
  Children,
  Fragment,
  isValidElement,
  PropsWithChildren,
  ReactNode,
} from 'react';
import { Box, Dialog as MUIDialog, DialogContent, Stack } from '@mui/material';
import { ResponsiveStyleValue } from '@mui/system';
import DialogActions from '@components/dialog_actions';
import IconButton from '@components/icon_button';
import Typography from '@components/typography';
import { IconClose } from '@components/icons';
import { useAppTranslation, useScrollFade } from '@hooks/index';
import { DialogProps } from './index.types';

const DEFAULT_PADDING = '24px';

// fragments are flattened, so an actions row wrapped in one is still found
const flatten = (children: ReactNode): ReactNode[] =>
  Children.toArray(children).flatMap((child) =>
    isValidElement(child) && child.type === Fragment
      ? flatten((child.props as PropsWithChildren).children)
      : [child]
  );

const isActionsRow = (child: ReactNode) =>
  isValidElement(child) && child.type === DialogActions;

// the pinned rows take the content's own padding, whatever shape it is, so
// the three line up at every breakpoint
const readPadding = (sx: DialogProps['sx']) => {
  const styles = (sx ?? {}) as Record<string, unknown>;

  return (styles.padding ??
    styles.p ??
    DEFAULT_PADDING) as ResponsiveStyleValue<string | number>;
};

/**
 * The title row and the actions row stay in place, and only the content
 * between them scrolls, so the buttons stay reachable however short the
 * screen is. The content dissolves at an edge it scrolls past.
 *
 * A `DialogActions` child is pinned on its own, so a dialog only needs to pass
 * `actions` when its buttons sit inside a component of its own.
 */
const Dialog = ({
  open,
  onClose,
  children,
  sx,
  PaperProps,
  header,
  actions,
  title,
  description,
  closable,
}: DialogProps) => {
  const { t } = useAppTranslation();

  const ref = useScrollFade();

  const padding = readPadding(sx);

  const items = flatten(children);

  // pinned as well, so a dialog need not hand its buttons over separately
  const childActions = items.filter(isActionsRow);

  const pinnedActions =
    actions ?? (childActions.length > 0 ? childActions : null);

  const content = actions ? items : items.filter((item) => !isActionsRow(item));

  const titleRow = header ?? (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        // a title on its own sits on the close button's line
        alignItems: description ? 'flex-start' : 'center',
        gap: '8px',
        width: '100%',
      }}
    >
      <Stack spacing="2px">
        <Typography className="h2">{title}</Typography>

        {description && (
          <Typography color="var(--grey-400)">{description}</Typography>
        )}
      </Stack>

      {closable && (
        <IconButton
          aria-label={t('tr_close')}
          onClick={onClose}
          // pulled into its padding, so the icon lines up with the edge
          sx={{ padding: '4px', margin: '-4px -4px -4px 0' }}
        >
          <IconClose color="var(--black)" />
        </IconButton>
      )}
    </Box>
  );

  /**
   * Handles the dialog close event.
   * @param {string} reason - The reason for closing the dialog.
   */
  const handleClose = (_, reason) => {
    if (reason === 'clickaway' || reason === 'backdropClick') {
      return;
    }

    onClose();
  };

  return (
    <MUIDialog
      fullWidth
      open={open}
      onClose={handleClose}
      sx={{
        boxSizing: 'border-box',
        '.MuiPaper-root': {
          margin: { mobile: '16px', tablet: '24px', desktop: '32px' },
        },
      }}
      PaperProps={
        PaperProps || {
          className: 'pop-up-shadow',
          style: {
            maxWidth: '560px',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--white)',
          },
        }
      }
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: 'var(--accent-dark-overlay)',
          },
        },
      }}
    >
      {(header || title) && (
        <Box sx={{ flexShrink: 0, padding, paddingBottom: '8px' }}>
          {titleRow}
        </Box>
      )}

      <DialogContent
        ref={ref}
        className="scroll-fade-y"
        sx={{
          padding,
          display: 'flex',
          flexDirection: 'column',
          gap: { mobile: '16px', desktop: '24px' },
          alignItems: 'flex-start',
          flex: '1 1 auto',
          minHeight: 0,
          overscrollBehavior: 'contain',
          ...sx,
        }}
      >
        {content}
      </DialogContent>

      {pinnedActions && (
        <Box sx={{ flexShrink: 0, padding, paddingTop: 0 }}>
          {pinnedActions}
        </Box>
      )}
    </MUIDialog>
  );
};

export default Dialog;
