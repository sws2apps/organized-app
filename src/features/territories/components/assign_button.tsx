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
};

const AssignButton = ({
  territory,
  onOpenAssign,
  onAssign,
  onDecline,
  onReturn,
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
        onClick={handleClick as never}
        startIcon={
          isAssigned ? (
            <IconMoveBack color="var(--red-main)" />
          ) : isRequested ? (
            <IconRaiseHand color="var(--orange-dark)" />
          ) : (
            <IconMoveForward color="var(--accent-main)" />
          )
        }
        sx={{ minHeight: '28px', padding: '2px 8px', minWidth: 'unset' }}
      >
        {isAssigned ? 'Return' : isRequested ? 'Review' : 'Assign'}
      </Button>
    </>
  );
};

export default AssignButton;
