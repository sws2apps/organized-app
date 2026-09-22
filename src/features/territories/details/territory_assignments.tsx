import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { shortDateFormatState } from '@states/settings';
import { Box, Stack } from '@mui/material';
import { Button } from '@components/index';
import { IconAdd, IconEdit } from '@icons/index';
import { Territory, TerritoryAssignment } from '@definition/territory';
import RecordList from '../components/record_list';
import RowAction from '../components/row_action';
import { StatusBadge } from '../components/territory_badges';
import {
  assignmentFromDates,
  displayDate,
  parseDate,
  emptyListMessage,
} from '../helpers';
import AssignmentEditor from './assignment_editor';

const newestFirst = (a: TerritoryAssignment, b: TerritoryAssignment) =>
  (parseDate(b.assignedOn)?.getTime() ?? 0) -
  (parseDate(a.assignedOn)?.getTime() ?? 0);

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
}: {
  territory: Territory;
  onChange?: (assignments: TerritoryAssignment[]) => void;
}) => {
  const format = useAtomValue(shortDateFormatState);

  const [editing, setEditing] = useState<TerritoryAssignment>();
  const [adding, setAdding] = useState(false);

  const assignments = territory.assignments;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <RecordList
        emptyMessage={emptyListMessage()}
        items={[...assignments].sort(newestFirst).map((assignment) => ({
          id: assignment.id,
          onClick: onChange && (() => setEditing(assignment)),
          title: assignment.publisher,
          subtitle: assignment.returnedOn
            ? `${displayDate(assignment.assignedOn, format)} – ${displayDate(assignment.returnedOn, format)}`
            : `Since ${displayDate(assignment.assignedOn, format)}`,
          badge: !assignment.returnedOn && (
            <Box sx={{ flexShrink: 0 }}>
              <StatusBadge status="in_work" />
            </Box>
          ),
          actions: onChange && (
            <RowAction title="Edit" onClick={() => setEditing(assignment)}>
              <IconEdit color="var(--accent-main)" width={18} height={18} />
            </RowAction>
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
            Add
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
          onDelete={() =>
            onChange(assignments.filter((item) => item.id !== editing.id))
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
