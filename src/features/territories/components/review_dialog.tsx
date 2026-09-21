import { Box, Stack } from '@mui/material';
import { Button, Typography } from '@components/index';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { IconClose, IconMoveForward } from '@icons/index';
import { daysLabel } from '../helpers';
import { CategoryBadges, StatusBadge } from './territory_badges';
import { Territory, TYPE_LABEL } from '@definition/territory';

export type ReviewDialogProps = {
  territory?: Territory;
  onClose: VoidFunction;
  onAssign: (id: string, publisher: string) => void;
  onDecline: (id: string) => void;
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      padding: '12px',
      borderRadius: 'var(--radius-l)',
      backgroundColor: 'var(--accent-150)',
      flex: 1,
      width: '100%',
    }}
  >
    <Typography className="label-small-regular" color="var(--accent-400)">
      {label}
    </Typography>
    <Typography className="body-small-semibold">{value}</Typography>
  </Box>
);

const ReviewDialog = ({
  territory,
  onClose,
  onAssign,
  onDecline,
}: ReviewDialogProps) => {
  if (!territory?.requestedBy) return null;

  const publisher = territory.requestedBy;

  return (
    <Dialog onClose={onClose} open sx={{ padding: '24px' }}>
      <Stack spacing="4px" sx={{ width: '100%' }}>
        <Typography className="h3">Request for {territory.number}</Typography>
        <Typography className="body-small-regular" color="var(--grey-400)">
          {territory.name} · {territory.city}
        </Typography>
      </Stack>

      <Stack
        direction="row"
        sx={{
          width: '100%',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <Box sx={{ width: 'fit-content' }}>
          <StatusBadge status={territory.status} />
        </Box>
        <CategoryBadges territory={territory} max={4} />
      </Stack>

      <Stack
        direction="row"
        sx={{ width: '100%', flexWrap: 'wrap', gap: '8px' }}
      >
        <Row label="Requested by" value={publisher} />
        <Row
          label="Last covered"
          value={daysLabel(territory.daysSinceCovered)}
        />
        <Row label="Type" value={TYPE_LABEL[territory.type]} />
        <Row label="Households" value={String(territory.households)} />
      </Stack>

      <DialogActions>
        <Button
          variant="secondary"
          color="red"
          startIcon={<IconClose color="var(--red-dark)" />}
          onClick={() => {
            onDecline(territory.id);
            onClose();
          }}
        >
          Decline
        </Button>
        <Button
          variant="main"
          startIcon={<IconMoveForward color="var(--always-white)" />}
          onClick={() => {
            onAssign(territory.id, publisher);
            onClose();
          }}
        >
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewDialog;
