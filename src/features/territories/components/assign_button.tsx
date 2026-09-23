import { MouseEvent, useState } from 'react';
import { Box } from '@mui/material';
import { Button } from '@components/index';
import { IconMoveBack, IconMoveForward, IconRaiseHand } from '@icons/index';
import ReviewDialog from './review_dialog';
import { Territory } from '@definition/territory';

type AssignButtonProps = {
  territory: Territory;
  onOpenAssign: (id: string) => void;
  onAssign: (id: string, publisher: string) => void;
  onDecline: (id: string) => void;
  onReturn: (id: string) => void;
  compact?: boolean;
};

const lookOf = (isAssigned: boolean, isRequested: boolean) => {
  if (isAssigned) {
    return {
      label: 'Return',
      color: 'red' as const,
      icon: <IconMoveBack color="var(--red-main)" />,
    };
  }

  if (isRequested) {
    return {
      label: 'Review',
      color: 'orange' as const,
      icon: <IconRaiseHand color="var(--orange-dark)" />,
    };
  }

  return {
    label: 'Assign',
    color: undefined,
    icon: <IconMoveForward color="var(--accent-main)" />,
  };
};

const AssignButton = ({
  territory,
  onOpenAssign,
  onAssign,
  onDecline,
  onReturn,
  compact = false,
}: AssignButtonProps) => {
  const [reviewOpen, setReviewOpen] = useState(false);

  const isAssigned =
    territory.status === 'in_work' || territory.status === 'overdue';

  const isRequested = Boolean(territory.requestedBy);

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
      {reviewOpen && (
        <Box onClick={(event) => event.stopPropagation()}>
          <ReviewDialog
            territory={territory}
            onClose={() => setReviewOpen(false)}
            onAssign={onAssign}
            onDecline={onDecline}
          />
        </Box>
      )}

      <Button
        variant="small"
        disableAutoStretch
        color={color}
        onClick={handleClick}
        startIcon={icon}
        aria-label={compact ? label : undefined}
        sx={{
          minHeight: '28px',
          padding: compact ? '4px' : '2px 8px',
          minWidth: 'unset',
          '& .MuiButton-startIcon': compact ? { margin: 0 } : {},
        }}
      >
        {!compact && label}
      </Button>
    </>
  );
};

export default AssignButton;
