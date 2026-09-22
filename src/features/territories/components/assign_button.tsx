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

  const label = isAssigned ? 'Return' : isRequested ? 'Review' : 'Assign';

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
        color={isAssigned ? 'red' : isRequested ? 'orange' : undefined}
        onClick={handleClick}
        startIcon={
          isAssigned ? (
            <IconMoveBack color="var(--red-main)" />
          ) : isRequested ? (
            <IconRaiseHand color="var(--orange-dark)" />
          ) : (
            <IconMoveForward color="var(--accent-main)" />
          )
        }
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
