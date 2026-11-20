import useCampaignSelection from '@features/territories/components/campaign_picker/useCampaignSelection';
import TerritoryNote from '@features/territories/components/note';
import TerritoryNoteField from '@features/territories/components/note_field';
import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { Box, Stack } from '@mui/material';
import { Badge, Button, InfoNote, Typography } from '@components/index';
import DatePicker from '@components/date_picker';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconCancelCicle } from '@icons/index';
import { shortDateFormatState } from '@states/settings';
import { territoryAssigneesState } from '@features/territories/assignees';
import { territoryCampaignsState } from '@features/territories/campaigns';
import { campaignSnapshot } from '@features/territories/campaign_dates';
import {
  chosenHolder,
  holderMissing,
  initialHolder,
  rememberCard,
  rememberHolder,
  savedCard,
} from '@features/territories/card_choice';
import { holderText } from '@features/territories/group_holder';
import {
  displayDate,
  doNotCallLabel,
  toStoredDate,
} from '@features/territories/helpers';
import { latestReturnNote } from '@features/territories/notes';
import {
  territoryAssignmentDateError,
  territoryHolderAvailable,
} from '@utils/territory_assignments';
import CampaignField, {
  CampaignChoice,
} from '@features/territories/components/campaign_field';
import CardField from '@features/territories/components/card_field';
import {
  HolderModeSwitch,
  HolderPickers,
} from '@features/territories/components/holder_picker';
import {
  AssignmentCard,
  AssignmentHolder,
  Territory,
  TerritoryAssignment,
} from '@definition/territory';

type AssignDialogProps = {
  title: string;
  subtitle?: string;
  requestedBy?: string;
  // a reminder for whoever hands the card over
  doNotCalls?: number;
  // the one territory going out, for its notes; a bulk assign has none
  territory?: Territory;
  onClose: VoidFunction;
  onAssign: (
    holder: AssignmentHolder,
    assignedOn: Date,
    campaign: TerritoryAssignment['campaign'] | null,
    card?: AssignmentCard,
    // optional, shown under the name in the assignment history
    note?: string
  ) => boolean;
};

const AssignDialog = ({
  title,
  subtitle,
  requestedBy,
  doNotCalls = 0,
  territory,
  onClose,
  onAssign,
}: AssignDialogProps) => {
  const { t } = useAppTranslation();
  const selectedCampaign = useCampaignSelection();

  const { tablet600Up } = useBreakpoints();

  const format = useAtomValue(shortDateFormatState);

  const assignees = useAtomValue(territoryAssigneesState);

  // still out: assigning returns it first, on the new start date
  const open = territory?.assignments.find((item) => !item.returnedOn);

  // whoever asked is the publisher; a transfer starts from the current holder
  const [holder, setHolder] = useState(() =>
    initialHolder(
      open,
      assignees.filter((item) => item.group).map(({ name }) => name),
      requestedBy
    )
  );
  const [tried, setTried] = useState(false);
  const [assignedOn, setAssignedOn] = useState<Date | null>(new Date());
  const [card, setCard] = useState<AssignmentCard | undefined>(savedCard);
  const [note, setNote] = useState('');

  const lastNote = territory && latestReturnNote(territory.assignments);

  const campaigns = useAtomValue(territoryCampaignsState);

  // Regular work stays the default unless a campaign was explicitly selected.
  const [manual, setManual] = useState<CampaignChoice>({
    checked: !!selectedCampaign,
    value: selectedCampaign,
  });
  const campaign = manual ?? { checked: false, value: undefined };

  const dateError = territoryAssignmentDateError(
    territory?.assignments ?? [],
    assignedOn
  );

  const holderAvailable = territoryHolderAvailable(
    chosenHolder(holder),
    assignees
  );

  return (
    <Dialog
      onClose={onClose}
      open
      header={
        // the badge sits top right, centred on the title, as on the
        // territory's overview
        <Stack
          direction="row"
          spacing="12px"
          sx={{ width: '100%', alignItems: 'flex-start' }}
        >
          <Stack spacing="2px" sx={{ flex: 1, minWidth: 0 }}>
            <Typography component="h2" className="h2">
              {title}
            </Typography>
            {subtitle && (
              <Typography color="var(--grey-400)">{subtitle}</Typography>
            )}
          </Stack>
          {doNotCalls > 0 && (
            <Box
              role="img"
              aria-label={doNotCallLabel(doNotCalls)}
              title={doNotCallLabel(doNotCalls)}
              sx={{
                flexShrink: 0,
                display: 'flex',
                minHeight: '24px',
                alignItems: 'center',
              }}
            >
              <Badge
                size="small"
                color="red"
                filled={false}
                // spelled out where there is room, the count alone on a phone
                text={
                  tablet600Up
                    ? t('tr_territoryDoNotCall', { n: doNotCalls })
                    : String(doNotCalls)
                }
                icon={<IconCancelCicle color="var(--red-dark)" />}
                sx={{ width: 'fit-content' }}
              />
            </Box>
          )}
        </Stack>
      }
    >
      <HolderModeSwitch value={holder} onChange={setHolder} />

      <TerritoryNote kind="territory" value={territory?.notes} />

      {lastNote && (
        <Typography
          className="body-small-regular"
          color="var(--grey-400)"
          sx={{ whiteSpace: 'pre-line' }}
        >
          {t('tr_territoryLastReturn', {
            name: holderText(lastNote),
            date: displayDate(lastNote.returnedOn, format),
            note: lastNote.note,
          })}
        </Typography>
      )}

      {open && assignedOn && (
        <InfoNote
          message={t('tr_territoryStillHasItItIsReturnedOnFirst', {
            name: holderText(open),
            date: displayDate(toStoredDate(assignedOn), format),
          })}
        />
      )}

      <HolderPickers
        value={holder}
        onChange={setHolder}
        showMissing={tried}
        autoFocus={!tablet600Up}
      />

      {tried && !holderAvailable && (
        <InfoNote message={t('tr_territoryAssigneeUnavailable')} />
      )}

      <DatePicker
        label={t('tr_territoryAssignedOn')}
        value={assignedOn}
        error={!!dateError}
        helperText={dateError ? t(dateError) : ''}
        onChange={(value) => setAssignedOn(value)}
      />

      <CardField value={card} onChange={setCard} />

      <TerritoryNoteField kind="assignment" value={note} onChange={setNote} />

      {campaigns.length > 0 && (
        <CampaignField
          checked={campaign.checked}
          value={campaign.value}
          onChange={setManual}
        />
      )}

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button
          variant="main"
          disabled={!!dateError}
          onClick={() => {
            if (!assignedOn || dateError) return;
            if (holderMissing(holder) || !holderAvailable) {
              setTried(true);
              return;
            }
            const chosen = chosenHolder(holder);
            const assigned = onAssign(
              chosen,
              assignedOn,
              campaign.checked && campaign.value
                ? campaignSnapshot(campaign.value)
                : null,
              card,
              note.trim() || undefined
            );
            if (!assigned) return;
            rememberCard(card);
            rememberHolder(chosen.group);
            onClose();
          }}
        >
          {t('tr_assign')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignDialog;
