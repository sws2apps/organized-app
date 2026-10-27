import useReturnDialog from '@features/territories/components/useReturnDialog';
import { useNavigate } from 'react-router';
import TerritoryNoteField from '@features/territories/components/note_field';
import { useAtomValue } from 'jotai';
import { Box, Stack } from '@mui/material';
import { Button, TextField, Typography } from '@components/index';
import DatePicker from '@components/date_picker';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import SwitchWithLabel from '@components/switch_with_label';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconArrowLink, IconPrint } from '@icons/index';
import { territoryLocalModeState } from '@states/territories';
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

const ReturnCampaign = ({
  selectedCampaign,
  linkedCampaign,
}: {
  selectedCampaign: NonNullable<TerritoryAssignment['campaign']>;
  linkedCampaign?: NonNullable<
    ReturnType<typeof useReturnDialog>
  >['linkedCampaign'];
}) => {
  const navigate = useNavigate();
  const localMode = useAtomValue(territoryLocalModeState);
  return linkedCampaign ? (
    <Button
      variant="small"
      disableAutoStretch
      endIcon={<IconArrowLink />}
      href={`#${localMode ? '/settings/campaigns' : '/territories/campaigns'}?event=${encodeURIComponent(selectedCampaign.id)}`}
      target={localMode ? undefined : '_blank'}
      rel="noopener noreferrer"
      onClick={
        localMode
          ? (event) => {
              event.preventDefault();
              navigate(
                `/settings/campaigns?event=${encodeURIComponent(selectedCampaign.id)}`
              );
            }
          : undefined
      }
      sx={{
        alignSelf: 'flex-start',
        textAlign: 'left',
        overflowWrap: 'anywhere',
      }}
    >
      {linkedCampaign.name}
    </Button>
  ) : (
    <Typography className="body-small-regular">
      {selectedCampaign.name}
    </Typography>
  );
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
    completed,
    setCompleted,
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
    selectedCampaign,
    linkedCampaign,
    overlapping,
    showHouseholds,
    handleReturn,
  } = state;
  const completedLabel = t(
    selectedCampaign ? 'tr_territoryCompleted' : 'tr_territoryRegularCovered'
  );

  return (
    <Dialog
      onClose={onClose}
      open
      title={t('tr_territoryReturnNumber', { number: territory.number })}
      description={
        own
          ? t('tr_territoryEnterTheReturnDateAndHouseholdCount')
          : t('tr_territoryConfirmTheReturnDateAndHouseholdCount')
      }
    >
      {open && !own && (
        <PublisherPicker
          label={t('tr_territoryReturnedBy')}
          value={returnedBy}
          onChange={setReturnedBy}
          current={open.publisher}
        />
      )}

      <Stack
        direction={tablet600Up ? 'row' : 'column'}
        spacing="16px"
        sx={{ width: '100%' }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <DatePicker
            label={t('tr_territoryReturnedOn')}
            value={returnedOn}
            error={!!dateError}
            helperText={dateError ? t(dateError) : ''}
            onChange={(value) => setReturnedOn(value)}
          />
        </Box>

        {showHouseholds && (
          <Box sx={{ flex: 1, minWidth: 0 }}>
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
      </Stack>

      <Stack spacing={1}>
        <SwitchWithLabel
          label={completedLabel}
          checked={completed}
          onChange={setCompleted}
          inputProps={{
            'aria-label': completedLabel,
          }}
        />
        {selectedCampaign && (
          <ReturnCampaign
            selectedCampaign={selectedCampaign}
            linkedCampaign={linkedCampaign}
          />
        )}
      </Stack>
      <TerritoryNoteField kind="assignment" value={note} onChange={setNote} />

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
        <CampaignField
          checked={campaign.checked}
          value={campaign.value}
          onChange={setCampaign}
        />
      )}

      {canAssignAgain && (
        <SwitchWithLabel
          label={t('tr_territoryAssignAgain')}
          helper={t('tr_territoryToTheSamePersonFromTheReturnDate')}
          checked={assignAgain}
          onChange={setAssignAgain}
        />
      )}

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
