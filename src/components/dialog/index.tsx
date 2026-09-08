import {
  Children,
  Fragment,
  isValidElement,
  PropsWithChildren,
  ReactNode,
} from 'react';
import { Box, Dialog as MUIDialog, DialogContent } from '@mui/material';
import DialogActions from '@components/dialog_actions';
import { useScrollFade } from '@hooks/index';
import { DialogProps } from './index.types';

const DEFAULT_PADDING = { mobile: '16px', desktop: '32px' };

/**
 * Flattens fragments, so an actions row a caller wrapped in one is still
 * recognised as a child of the dialog.
 */
const flatten = (children: ReactNode): ReactNode[] =>
  Children.toArray(children).flatMap((child) =>
    isValidElement(child) && child.type === Fragment
      ? flatten((child.props as PropsWithChildren).children)
      : [child]
  );

const isActionsRow = (child: ReactNode) =>
  isValidElement(child) && child.type === DialogActions;

/**
 * Reads the padding a caller passed through `sx`, so the pinned header and
 * actions line up with the scrollable content.
 */
const readPadding = (sx: DialogProps['sx']) => {
  const styles = (sx ?? {}) as Record<string, unknown>;

  const padding = styles.padding ?? styles.p;

  if (typeof padding === 'number') return `${padding}px`;

  return typeof padding === 'string' ? padding : DEFAULT_PADDING;
};

/**
 * Component for rendering a custom dialog.
 *
 * The title row (`header`) and the actions row stay in place, and only the
 * content between them scrolls, so the buttons stay reachable however short
 * the screen is. The content dissolves at an edge it scrolls past instead of
 * being cut off.
 *
 * A `DialogActions` child is pinned on its own, so a dialog only needs to pass
 * `actions` when its buttons sit inside a component of its own.
 *
 * @param {Object} props - Props for the CustomDialog component.
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {VoidFunction} props.onClose - Function to handle dialog close event.
 * @param {React.ReactNode} props.header - Title row pinned above the content.
 * @param {React.ReactNode} props.actions - Actions row pinned below the content.
 * @param {React.ReactNode} props.children - Content to be rendered inside the dialog.
 * @param {SxProps} props.sx - Custom styling for the dialog content.
 * @returns {JSX.Element} CustomDialog component.
 */
const Dialog = ({
  open,
  onClose,
  children,
  sx,
  PaperProps,
  header,
  actions,
}: DialogProps) => {
  const ref = useScrollFade();

  const padding = readPadding(sx);

  const items = flatten(children);

  // an actions row among the children is pinned as well, so a dialog keeps its
  // buttons reachable without having to hand them over separately
  const childActions = items.filter(isActionsRow);

  const pinnedActions =
    actions ?? (childActions.length > 0 ? childActions : null);

  const content = actions ? items : items.filter((item) => !isActionsRow(item));

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
      {header && (
        <Box sx={{ flexShrink: 0, padding, paddingBottom: '8px' }}>
          {header}
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
