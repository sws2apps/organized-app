import { useAppTranslation } from '@hooks/index';
import { Box, Stack } from '@mui/material';
import { Button } from '@components/index';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { IconMoveForward, IconReject } from '@icons/index';
import { coveredText } from '@features/territories/helpers';
import {
  CategoryBadges,
  DoNotCallBadge,
  StatusBadge,
} from '@features/territories/components/territory_badges';
import StatTile from '@features/territories/components/stat_tile';
import { Territory, TYPE_LABEL } from '@definition/territory';

type ReviewDialogProps = {
  territory?: Territory;
  onClose: VoidFunction;
  // opens the assign dialog, with whoever asked filled in
  onAssign: (id: string) => void;
  onDecline: (id: string) => void;
};

const ReviewDialog = ({
  territory,
  onClose,
  onAssign,
  onDecline,
}: ReviewDialogProps) => {
  const { t } = useAppTranslation();

  if (!territory?.requestedBy) return null;

  const publisher = territory.requestedBy;

  return (
    <Dialog
      onClose={onClose}
      open
      closable
      title={t('tr_territoryRequestForTerritory')}
      description={[territory.number, territory.name, territory.city]
        .filter(Boolean)
        .join(' · ')}
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
        <DoNotCallBadge territory={territory} />
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
        <StatTile label={t('tr_territoryRequestedBy')} value={publisher} />
        <StatTile
          label={t('tr_territoryLastCovered')}
          value={coveredText(territory)}
        />
        <StatTile label={t('tr_type')} value={t(TYPE_LABEL[territory.type])} />
        <StatTile
          label={t('tr_territoryHouseholds')}
          value={String(territory.households)}
        />
      </Box>

      <DialogActions>
        <Button
          variant="secondary"
          color="red"
          startIcon={<IconReject color="var(--red-main)" />}
          onClick={() => {
            onDecline(territory.id);
            onClose();
          }}
        >
          {t('tr_territoryRefuse')}
        </Button>
        <Button
          variant="main"
          startIcon={<IconMoveForward color="var(--always-white)" />}
          onClick={() => {
            onAssign(territory.id);
            onClose();
          }}
        >
          {t('tr_assign')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewDialog;
