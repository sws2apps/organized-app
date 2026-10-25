import useTerritoryAccess from '@features/territories/useTerritoryAccess';
import { territoryPermissions } from '@services/app/territory_access';
import { useAppTranslation } from '@hooks/index';
import { MouseEvent, useState } from 'react';
import { Box } from '@mui/material';
import { Button } from '@components/index';
import { IconCheckThin, IconMoveItem, IconRaiseHand } from '@icons/index';
import ReviewDialog from '@features/territories/components/review_dialog';
import { DONE_COLOR } from '@features/territories/components/done_color';
import { Territory } from '@definition/territory';

type AssignButtonProps = {
  territory: Territory;
  onOpenAssign: (id: string) => void;
  onDecline: (id: string) => void;
  onReturn: (id: string) => void;
  compact?: boolean;
  // just the word: no icon, no width shared with the other labels
  bare?: boolean;
};

const LABELS = ['tr_return', 'tr_territoryReview', 'tr_assign'];

const lookOf = (isAssigned: boolean, isRequested: boolean) => {
  if (isAssigned) {
    return {
      label: 'tr_return',
      color: 'green' as const,
      icon: <IconCheckThin color="var(--done)" />,
    };
  }

  if (isRequested) {
    return {
      label: 'tr_territoryReview',
      color: 'orange' as const,
      icon: <IconRaiseHand color="var(--orange-dark)" />,
    };
  }

  return {
    label: 'tr_assign',
    color: undefined,
    icon: <IconMoveItem color="var(--accent-dark)" />,
  };
};

const AssignButton = ({
  territory,
  onOpenAssign,
  onDecline,
  onReturn,
  compact = false,
  bare = false,
}: AssignButtonProps) => {
  const { t } = useAppTranslation();

  const [reviewOpen, setReviewOpen] = useState(false);
  const context = useTerritoryAccess();
  const permissions = territoryPermissions(territory, context);

  const isAssigned =
    territory.status === 'in_work' || territory.status === 'overdue';

  const isRequested = Boolean(territory.requestedBy);

  if (!context.editor && !permissions.return) return null;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    if (isAssigned) {
      onReturn(territory.id);
      return;
    }

    if (isRequested) {
      setReviewOpen(true);
      return;
    }

    onOpenAssign(territory.id);
  };

  const { label, color, icon } = lookOf(isAssigned, isRequested);

  return (
    <>
      {context.editor && reviewOpen && (
        <Box onClick={(event) => event.stopPropagation()}>
          <ReviewDialog
            territory={territory}
            onClose={() => setReviewOpen(false)}
            onAssign={onOpenAssign}
            onDecline={onDecline}
          />
        </Box>
      )}

      <Button
        variant="small"
        disableAutoStretch
        color={color}
        onClick={handleClick}
        startIcon={bare && !compact ? undefined : icon}
        ariaLabel={t(label)}
        sx={{
          minHeight: '28px',
          padding: compact ? '4px' : '2px 8px',
          minWidth: 'unset',
          justifyContent: 'flex-start',
          // the palette has no green-dark for small buttons
          ...(color === 'green' && {
            ...DONE_COLOR,
            color: 'var(--done)',
            '& svg, & svg g, & svg g path': { fill: 'var(--done)' },
          }),
          '& .MuiButton-startIcon': compact ? { margin: 0 } : {},
          // 28px to see, 44px to tap
          '&::after': { content: '""', position: 'absolute', inset: '-8px' },
        }}
      >
        {!compact && bare && t(label)}
        {!compact && !bare && (
          // every label stacked in one cell, so all buttons share the widest width
          <Box sx={{ display: 'grid', textAlign: 'start' }}>
            {LABELS.map((text) => (
              <Box
                key={text}
                component="span"
                aria-hidden={text !== label}
                sx={{
                  gridArea: '1 / 1',
                  visibility: text === label ? 'visible' : 'hidden',
                }}
              >
                {t(text)}
              </Box>
            ))}
          </Box>
        )}
      </Button>
    </>
  );
};

export default AssignButton;
