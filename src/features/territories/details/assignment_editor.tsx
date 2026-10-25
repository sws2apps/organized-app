import SwitchWithLabel from '@components/switch_with_label';
import TerritoryNoteField from '@features/territories/components/note_field';
import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { Box, Stack } from '@mui/material';
import { Button, InfoNote } from '@components/index';
import DatePicker from '@components/date_picker';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconCopy } from '@icons/index';
import { territoryAssigneesState } from '@features/territories/assignees';
import { territoryCampaignsState } from '@features/territories/campaigns';
import { campaignSnapshot } from '@features/territories/campaign_dates';
import CampaignField, {
  CampaignChoice,
} from '@features/territories/components/campaign_field';
import CardField from '@features/territories/components/card_field';
import EditorHeader from '@features/territories/components/editor_header';
import {
  HolderModeSwitch,
  HolderPickers,
} from '@features/territories/components/holder_picker';
import {
  chosenHolder,
  holderMissing,
  initialHolder,
  savedCard,
} from '@features/territories/card_choice';
import {
  assignmentFromDates,
  assignmentIssues,
  parseDate,
  toStoredDate,
} from '@features/territories/helpers';
import { AssignmentCard, TerritoryAssignment } from '@definition/territory';

const AssignmentEditor = ({
  assignment,
  isNew = false,
  otherOpen = false,
  onClose,
  onSave,
  onDelete,
  onAdoptNote,
}: {
  assignment: TerritoryAssignment;
  isNew?: boolean;
  otherOpen?: boolean;
  onClose: VoidFunction;
  onSave: (next: TerritoryAssignment) => void;
  onDelete?: VoidFunction;
  // the note is worth keeping on the territory itself
  onAdoptNote?: (note: string) => void;
}) => {
  const { t } = useAppTranslation();

  const { tablet600Up } = useBreakpoints();

  const assignees = useAtomValue(territoryAssigneesState);
  const campaigns = useAtomValue(territoryCampaignsState);

  const [holder, setHolder] = useState(() =>
    initialHolder(
      assignment,
      assignees.filter((item) => item.group).map(({ name }) => name)
    )
  );
  const [tried, setTried] = useState(false);
  const [assignedOn, setAssignedOn] = useState<Date | null>(
    parseDate(assignment.assignedOn) ?? new Date()
  );
  const [returnedOn, setReturnedOn] = useState<Date | null>(
    parseDate(assignment.returnedOn)
  );
  const [completed, setCompleted] = useState(assignment.completed !== false);
  const [note, setNote] = useState(assignment.note ?? '');
  const [card, setCard] = useState<AssignmentCard | undefined>(
    assignment.card ?? (isNew ? savedCard() : undefined)
  );

  const [campaign, setCampaign] = useState<CampaignChoice>({
    checked: !!assignment.campaign,
    value: assignment.campaign,
  });

  // allowed, but worth a second look
  const issues = assignmentIssues({
    assignedOn: assignedOn ? toStoredDate(assignedOn) : '',
    returnedOn: returnedOn ? toStoredDate(returnedOn) : undefined,
  });

  const returnedTooEarly = issues.includes('returned_before_assigned');
  const secondOpen = otherOpen && !returnedOn;
  let returnedDateHint = '';
  if (returnedTooEarly)
    returnedDateHint = t('tr_territoryCannotBeBeforeTheAssignedDate');
  else if (issues.includes('returned_future'))
    returnedDateHint = t('tr_territoryThisDateIsInTheFuture');

  return (
    <Dialog
      onClose={onClose}
      open
      header={
        <EditorHeader
          title={
            isNew
              ? t('tr_territoryAddAssignment')
              : t('tr_territoryEditAssignment')
          }
          description={t('tr_territoryWhoWorkedTheTerritoryAndWhenItWasTaken')}
          onDelete={
            onDelete && !isNew
              ? () => {
                  onDelete();
                  onClose();
                }
              : undefined
          }
        />
      }
    >
      <HolderModeSwitch value={holder} onChange={setHolder} />

      <HolderPickers
        value={holder}
        onChange={setHolder}
        showMissing={tried || (!isNew && !assignment.publisher)}
        autoFocus={!tablet600Up}
        current={assignment}
      />

      <Stack
        direction={tablet600Up ? 'row' : 'column'}
        spacing="16px"
        sx={{ width: '100%' }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <DatePicker
            label={t('tr_territoryAssignedOn')}
            value={assignedOn}
            error={issues.includes('assigned_future')}
            helperText={
              issues.includes('assigned_future')
                ? t('tr_territoryThisDateIsInTheFuture')
                : ''
            }
            onChange={(value) => setAssignedOn(value)}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <DatePicker
            label={t('tr_territoryReturnedOn')}
            value={returnedOn}
            minDate={assignedOn}
            error={returnedTooEarly || issues.includes('returned_future')}
            helperText={returnedDateHint}
            onChange={(value) => setReturnedOn(value)}
          />
        </Box>
      </Stack>

      <CardField value={card} onChange={setCard} />

      {returnedOn && (
        <SwitchWithLabel
          label={t('tr_territoryCompleted')}
          checked={completed}
          onChange={setCompleted}
        />
      )}
      <TerritoryNoteField kind="assignment" value={note} onChange={setNote} />

      {onAdoptNote && (
        <Button
          variant="small"
          disableAutoStretch
          startIcon={<IconCopy color="var(--accent-main)" />}
          disabled={!note.trim()}
          onClick={() => onAdoptNote(note)}
          sx={{ minHeight: '32px', minWidth: 'unset', marginTop: '-8px' }}
        >
          {t('tr_territoryAddToTerritoryNotes')}
        </Button>
      )}

      {(campaigns.length > 0 || campaign.value) && (
        <CampaignField
          checked={campaign.checked}
          value={campaign.value}
          onChange={setCampaign}
        />
      )}

      {secondOpen && (
        <InfoNote
          message={t('tr_territoryTheTerritoryIsAlreadyOutWithSomeoneAddA')}
        />
      )}

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button
          variant="main"
          disabled={returnedTooEarly || secondOpen}
          onClick={() => {
            if (holderMissing(holder)) {
              setTried(true);
              return;
            }
            const pickedHolder = chosenHolder(holder);
            const { publisher, group } = pickedHolder;
            onSave({
              ...assignmentFromDates(
                assignment,
                publisher,
                assignedOn ?? new Date(),
                returnedOn
              ),
              ...pickedHolder,
              group,
              campaign:
                campaign.checked && campaign.value
                  ? campaignSnapshot(campaign.value)
                  : undefined,
              note: note.trim() || undefined,
              completed: returnedOn ? completed : undefined,
              card,
            });
            onClose();
          }}
        >
          {t('tr_save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignmentEditor;
