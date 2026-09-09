import {
  Children,
  Fragment,
  isValidElement,
  PropsWithChildren,
  ReactNode,
  useId,
} from 'react';
import {
  Box,
  Dialog as MUIDialog,
  DialogContent,
  Stack,
  Theme,
  useTheme,
} from '@mui/material';
import { ResponsiveStyleValue } from '@mui/system';
import DialogActions from '@components/dialog_actions';
import IconButton from '@components/icon_button';
import Typography from '@components/typography';
import { IconClose } from '@components/icons';
import { useAppTranslation, useScrollFade } from '@hooks/index';
import { DialogProps } from './index.types';

const DEFAULT_PADDING = 'var(--dialog-padding)';

// fragments are flattened, so an actions row wrapped in one is still found
const flatten = (children: ReactNode): ReactNode[] =>
  Children.toArray(children).flatMap((child) =>
    isValidElement(child) && child.type === Fragment
      ? flatten((child.props as PropsWithChildren).children)
      : [child]
  );

const isActionsRow = (child: ReactNode) =>
  isValidElement(child) && child.type === DialogActions;

// sx is an object, a callback taking the theme, or an array of either
const resolveSx = (
  sx: DialogProps['sx'],
  theme: Theme
): Record<string, unknown> => {
  if (!sx) return {};

  if (Array.isArray(sx)) {
    return sx.reduce<Record<string, unknown>>(
      (merged, entry) => ({
        ...merged,
        ...resolveSx(entry as DialogProps['sx'], theme),
      }),
      {}
    );
  }

  if (typeof sx === 'function') return resolveSx(sx(theme), theme);

  return sx as Record<string, unknown>;
};

// the pinned rows take the content's own padding, whatever shape it is, so
// the three line up at every breakpoint
const readPadding = (sx: DialogProps['sx'], theme: Theme) => {
  const styles = resolveSx(sx, theme);

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

  // dialogs can be open at once, so each names itself by its own heading
  const titleId = useId();

  const ref = useScrollFade();

  const theme = useTheme();

  const padding = readPadding(sx, theme);

  const items = flatten(children);

  // pinned as well, so a dialog need not hand its buttons over separately
  const childActions = items.filter(isActionsRow);

  const pinnedActions =
    actions ?? (childActions.length > 0 ? childActions : null);

  const content = (
    actions ? items : items.filter((item) => !isActionsRow(item))
  ).filter((item) => item !== null && item !== false && item !== '');

  // the close button belongs to the row whichever way the header is built
  const titleRow = (header || title || closable) && (
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
      {header ?? (
        <Stack spacing="2px">
          <Typography className="h2" id={titleId}>
            {title}
          </Typography>

          {description && (
            <Typography color="var(--grey-400)">{description}</Typography>
          )}
        </Stack>
      )}

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
      aria-labelledby={title ? titleId : undefined}
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
      {titleRow && (
        <Box
          sx={{
            flexShrink: 0,
            padding,
            paddingBottom: 'var(--dialog-header-gap)',
          }}
        >
          {titleRow}
        </Box>
      )}

      {content.length > 0 && (
        <DialogContent
          ref={ref}
          className="scroll-fade-y"
          sx={{
            padding,
            display: 'flex',
            flexDirection: 'column',
            gap: {
              mobile: 'var(--dialog-gap-mobile)',
              desktop: 'var(--dialog-gap)',
            },
            alignItems: 'flex-start',
            flex: '1 1 auto',
            minHeight: 0,
            overscrollBehavior: 'contain',
            ...sx,
          }}
        >
          {content}
        </DialogContent>
      )}

      {pinnedActions && (
        <Box
          sx={{
            flexShrink: 0,
            padding,
            // with nothing between the rows, the buttons take the gap the
            // content would have held
            paddingTop:
              content.length > 0
                ? 0
                : {
                    mobile:
                      'calc(var(--dialog-gap-mobile) - var(--dialog-header-gap))',
                    desktop:
                      'calc(var(--dialog-gap) - var(--dialog-header-gap))',
                  },
          }}
        >
          {pinnedActions}
        </Box>
      )}
    </MUIDialog>
  );
};

export default Dialog;
