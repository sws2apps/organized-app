import TerritoryNote from '@features/territories/components/note';
import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { shortDateFormatState } from '@states/settings';
import { Box, Stack } from '@mui/material';
import { Button } from '@components/index';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconAdd, IconCopy, IconEdit } from '@icons/index';
import { Territory, TerritoryAssignment } from '@definition/territory';
import RecordList from '@features/territories/components/record_list';
import RowAction from '@features/territories/components/row_action';
import {
  CampaignBadge,
  CardBadge,
  StatusBadge,
} from '@features/territories/components/territory_badges';
import {
  assignmentFromDates,
  assignmentIssues,
  displayDate,
  issuesText,
  parseDate,
  emptyListMessage,
} from '@features/territories/helpers';
import { appendNote } from '@features/territories/notes';
import {
  holderText,
  missingPublisher,
} from '@features/territories/group_holder';
import { offerUndo } from '@features/territories/undo';
import { restoreAssignment } from '@features/territories/restore';
import AssignmentEditor from '@features/territories/details/assignment_editor';

const oldestFirst = (a: TerritoryAssignment, b: TerritoryAssignment) =>
  (parseDate(a.assignedOn)?.getTime() ?? 0) -
  (parseDate(b.assignedOn)?.getTime() ?? 0);

const blankAssignment = (): TerritoryAssignment =>
  assignmentFromDates(
    {
      id: `ta-${Date.now()}`,
      publisher: '',
      assignedOn: '',
      months: 0,
      serviceYear: 0,
      startMonth: 0,
      endMonth: 0,
    },
    '',
    new Date(),
    null
  );

const TerritoryAssignments = ({
  territory,
  onChange,
  onNotes,
}: {
  territory: Territory;
  onChange?: (assignments: TerritoryAssignment[]) => void;
  // a note worth keeping goes into the territory's notes
  onNotes?: (notes: string) => void;
}) => {
  const { t } = useAppTranslation();

  const { tablet688Up } = useBreakpoints();

  const format = useAtomValue(shortDateFormatState);

  const [editing, setEditing] = useState<TerritoryAssignment>();
  const [adding, setAdding] = useState(false);

  const assignments = territory.assignments;

  const adoptable = (note?: string) =>
    !!onNotes && !!note?.trim() && !territory.notes?.includes(note.trim());

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <RecordList
        emptyMessage={emptyListMessage()}
        items={[...assignments].sort(oldestFirst).map((assignment) => ({
          id: assignment.id,
          onClick: onChange && (() => setEditing(assignment)),
          title: holderText(assignment),
          content: <TerritoryNote kind="assignment" value={assignment.note} />,
          date: assignment.returnedOn
            ? `${displayDate(assignment.assignedOn, format)} – ${displayDate(assignment.returnedOn, format)}`
            : t('tr_territorySince', {
                date: displayDate(assignment.assignedOn, format),
              }),
          warning: [
            missingPublisher(assignment) &&
              t('tr_territoryFillInWhoItIsAssignedTo'),
            issuesText(assignmentIssues(assignment)),
          ]
            .filter(Boolean)
            .join(' · '),
          badge: (!assignment.returnedOn ||
            assignment.campaign ||
            assignment.card) && (
            <Stack direction="row" spacing="4px" sx={{ flexShrink: 0 }}>
              {!assignment.returnedOn && <StatusBadge status="in_work" />}
              <CardBadge card={assignment.card} text={tablet688Up} />
              <CampaignBadge assignment={assignment} />
            </Stack>
          ),
          actions: (onChange || adoptable(assignment.note)) && (
            <>
              {adoptable(assignment.note) && (
                <RowAction
                  title={t('tr_territoryAddToTerritoryNotes')}
                  onClick={() =>
                    onNotes?.(appendNote(territory.notes, assignment.note!))
                  }
                >
                  <IconCopy color="var(--accent-main)" width={18} height={18} />
                </RowAction>
              )}
              {onChange && (
                <RowAction
                  title={t('tr_edit')}
                  onClick={() => setEditing(assignment)}
                >
                  <IconEdit color="var(--accent-main)" width={18} height={18} />
                </RowAction>
              )}
            </>
          ),
        }))}
      />

      {onChange && (
        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
          <Button
            variant="small"
            disableAutoStretch
            startIcon={<IconAdd color="var(--accent-main)" />}
            onClick={() => {
              setEditing(blankAssignment());
              setAdding(true);
            }}
            sx={{ minHeight: '32px', minWidth: 'unset' }}
          >
            {t('tr_add')}
          </Button>
        </Stack>
      )}

      {editing && onChange && (
        <AssignmentEditor
          assignment={editing}
          isNew={adding}
          otherOpen={assignments.some(
            (item) => item.id !== editing.id && !item.returnedOn
          )}
          onClose={() => {
            setEditing(undefined);
            setAdding(false);
          }}
          onDelete={() => {
            const index = assignments.findIndex(
              (item) => item.id === editing.id
            );
            onChange(assignments.filter((item) => item.id !== editing.id));
            offerUndo({
              text: t('tr_territoryAssignmentDeleted'),
              revert: () => restoreAssignment(territory.id, editing, index),
            });
          }}
          onAdoptNote={
            onNotes
              ? (note) => onNotes(appendNote(territory.notes, note))
              : undefined
          }
          onSave={(next) =>
            onChange(
              adding
                ? [...assignments, next]
                : assignments.map((item) => (item.id === next.id ? next : item))
            )
          }
        />
      )}
    </Box>
  );
};

export default TerritoryAssignments;
