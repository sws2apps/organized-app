import useReturnDialog from '@features/territories/components/useReturnDialog';
import TerritoryNoteField from '@features/territories/components/note_field';
import { Box, Stack } from '@mui/material';
import { Button, TextField, Typography } from '@components/index';
import DatePicker from '@components/date_picker';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import Divider from '@components/divider';
import SwitchWithLabel from '@components/switch_with_label';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconPrint } from '@icons/index';
import CampaignField from '@features/territories/components/campaign_field';
import { PublisherPicker } from '@features/territories/components/holder_picker';
import {
  AssignmentHolder,
  Territory,
  TerritoryAssignment,
} from '@definition/territory';

export type ReturnDialogProps = {
  territory?: Territory;
  // a publisher giving back their own: no campaign decisions
  own?: boolean;
  onClose: VoidFunction;
  onReturn: (
    id: string,
    households: number,
    returnedOn: Date,
    campaign?: TerritoryAssignment['campaign'] | null,
    note?: string,
    publisher?: string,
    completed?: boolean
  ) => boolean;
  onAssignAgain?: (
    id: string,
    holder: AssignmentHolder,
    assignedOn: Date
  ) => boolean;
};

const ReturnDialog = ({
  territory,
  own = false,
  onClose,
  onReturn,
  onAssignAgain,
}: ReturnDialogProps) => {
  const { t } = useAppTranslation();

  const { tablet600Up } = useBreakpoints();

  const state = useReturnDialog({
    territory,
    own,
    onClose,
    onReturn,
    onAssignAgain,
  });
  if (!state || !territory) return null;
  const {
    open,
    households,
    setHouseholds,
    returnedOn,
    setReturnedOn,
    note,
    setNote,
    returnedBy,
    setReturnedBy,
    assignAgain,
    setAssignAgain,
    campaign,
    setCampaign,
    flagged,
    canAssignAgain,
    reassign,
    dateError,
    count,
    overlapping,
    showHouseholds,
    handleReturn,
  } = state;

  return (
    <Dialog
      onClose={onClose}
      open
      header={
        <Stack spacing="2px" sx={{ minWidth: 0 }}>
          <Typography component="h2" className="h2">
            {t('tr_territoryReturnNumber', { number: territory.number })}
          </Typography>
          <Typography color="var(--grey-400)">
            {[territory.name, territory.city].filter(Boolean).join(' · ')}
          </Typography>
          {territory.notes?.trim() && (
            <Typography
              className="body-small-regular"
              sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
            >
              {t('tr_territoryNoteInline', { note: territory.notes })}
            </Typography>
          )}
        </Stack>
      }
    >
      {open && !own && (
        <>
          <PublisherPicker
            label={t('tr_territoryReturnedBy')}
            value={returnedBy}
            onChange={setReturnedBy}
            current={open.publisher}
          />
          <Divider color="var(--accent-200)" sx={{ width: '100%' }} />
        </>
      )}

      <Typography component="h3" className="body-small-semibold">
        {t('tr_territoryAssignmentHeading')}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gap: '16px',
          gridTemplateColumns:
            tablet600Up && showHouseholds
              ? 'repeat(2, minmax(0, 1fr))'
              : 'minmax(0, 1fr)',
          gridTemplateAreas:
            tablet600Up && showHouseholds
              ? ['"returned households"', canAssignAgain && '"again again"']
                  .filter(Boolean)
                  .join(' ')
              : [
                  '"returned"',
                  canAssignAgain && '"again"',
                  showHouseholds && '"households"',
                ]
                  .filter(Boolean)
                  .join(' '),
        }}
      >
        <Box sx={{ gridArea: 'returned', minWidth: 0 }}>
          <DatePicker
            label={t('tr_territoryReturnedOn')}
            value={returnedOn}
            error={!!dateError}
            helperText={dateError ? t(dateError) : ''}
            onChange={(value) => setReturnedOn(value)}
          />
        </Box>
        {canAssignAgain && (
          <Box sx={{ gridArea: 'again', minWidth: 0 }}>
            <SwitchWithLabel
              label={t('tr_territoryAssignAgain')}
              helper={t('tr_territoryToTheSamePersonFromTheReturnDate')}
              checked={assignAgain}
              onChange={setAssignAgain}
            />
          </Box>
        )}
        {showHouseholds && (
          <Box sx={{ gridArea: 'households', minWidth: 0 }}>
            <TextField
              label={t('tr_territoryHouseholds')}
              type="number"
              value={households}
              error={count === undefined}
              helperText={
                count === undefined
                  ? t('tr_territoryEnterAWholeNumber0OrMore')
                  : ''
              }
              slotProps={{ htmlInput: { min: 0, step: 1 } }}
              onChange={(event) => setHouseholds(event.target.value)}
            />
          </Box>
        )}
      </Box>

      {/* a card went out with it: a nudge to take it back */}
      {open?.card === 'printed' && (
        <Stack direction="row" spacing="8px" sx={{ alignItems: 'center' }}>
          <IconPrint color="var(--grey-400)" width={20} height={20} />
          <Typography className="body-small-regular" color="var(--grey-400)">
            {t('tr_territoryPrintedMap')}
          </Typography>
        </Stack>
      )}

      {!own && (flagged || overlapping.length > 0) && (
        <>
          <Divider color="var(--accent-200)" sx={{ width: '100%' }} />
          <CampaignField
            checked={campaign.checked}
            value={campaign.value}
            onChange={setCampaign}
          />
        </>
      )}

      <TerritoryNoteField kind="assignment" value={note} onChange={setNote} />

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button
          variant="main"
          disabled={!returnedOn || !!dateError || count === undefined}
          onClick={handleReturn}
        >
          {reassign ? t('tr_territoryReturnAndAssign') : t('tr_return')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReturnDialog;
