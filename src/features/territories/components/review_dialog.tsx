import { Box, Stack } from '@mui/material';
import { Button } from '@components/index';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { IconClose, IconMoveForward } from '@icons/index';
import { daysLabel } from '../helpers';
import { CategoryBadges, StatusBadge } from './territory_badges';
import StatTile from './stat_tile';
import { Territory, TYPE_LABEL } from '@definition/territory';

type ReviewDialogProps = {
  territory?: Territory;
  onClose: VoidFunction;
  onAssign: (id: string, publisher: string) => void;
  onDecline: (id: string) => void;
};

const ReviewDialog = ({
  territory,
  onClose,
  onAssign,
  onDecline,
}: ReviewDialogProps) => {
  if (!territory?.requestedBy) return null;

  const publisher = territory.requestedBy;

  return (
    <Dialog
      onClose={onClose}
      open
      title={`Request for ${territory.number}`}
      description={`${territory.name} · ${territory.city}`}
    >
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

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '8px',
          width: '100%',
        }}
      >
        <StatTile label="Requested by" value={publisher} />
        <StatTile
          label="Last covered"
          value={daysLabel(territory.daysSinceCovered)}
        />
        <StatTile label="Type" value={TYPE_LABEL[territory.type]} />
        <StatTile label="Households" value={String(territory.households)} />
      </Box>

      <DialogActions>
        <Button
          variant="secondary"
          color="red"
          startIcon={<IconClose color="var(--red-main)" />}
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
