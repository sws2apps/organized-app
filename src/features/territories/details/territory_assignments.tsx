import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { useState } from 'react';
import { Badge, Button, InfoNote, Typography } from '@components/index';
import TableHead from '@components/table/TableHead';
import { IconAdd, IconDelete, IconEdit } from '@icons/index';
import RowAction from '../components/row_action';
import AssignmentEditor from './assignment_editor';
import useTableSort from '../useTableSort';
import { assignmentFromDates } from '../helpers';
import { Territory, TerritoryAssignment } from '@definition/territory';

const sortValue = (assignment: TerritoryAssignment, key: string) => {
  switch (key) {
    case 'publisher':
      return assignment.publisher;
    case 'returned':
      return assignment.endMonth;
    default:
      return assignment.startMonth;
  }
};

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
  const [editing, setEditing] = useState<TerritoryAssignment | undefined>();
  const [adding, setAdding] = useState(false);

  const { order, orderBy, handleRequestSort } = useTableSort(
    'assigned',
    ['assigned', 'returned'],
    'desc'
  );

  const rows = [...territory.assignments].sort((a, b) => {
    const left = sortValue(a, orderBy);
    const right = sortValue(b, orderBy);

    const compared =
      typeof left === 'string' && typeof right === 'string'
        ? left.localeCompare(right)
        : Number(left) - Number(right);

    return order === 'asc' ? compared : -compared;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* the details page already labels this through its tab */}
      {rows.length > 0 && !onChange && (
        <Stack direction="row" spacing="12px" sx={{ alignItems: 'center' }}>
          <Typography className="body-small-semibold" color="var(--black)">
            Assignment history
          </Typography>
          <Box sx={{ width: 'fit-content' }}>
            <Badge
              size="small"
              filled={false}
              color="accent"
              text={String(territory.assignments.length)}
            />
          </Box>
        </Stack>
      )}

      {rows.length === 0 && (
        <InfoNote message="No assignments recorded for this territory." />
      )}

      {rows.length > 0 && (
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table
            size="small"
            sx={{
              tableLayout: 'fixed',
              minWidth: onChange ? '420px' : '300px',
              '& .MuiTableCell-root': {
                padding: '10px 8px',
                borderColor: 'var(--accent-200)',
              },
              '& .MuiTableHead-root .MuiTableCell-root': {
                backgroundColor: 'transparent',
              },
              '& .MuiTableBody-root .MuiTableRow-root:last-of-type .MuiTableCell-root':
                {
                  borderBottom: 'none',
                },
            }}
          >
            <TableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              columns={[
                { id: 'publisher', label: 'Publisher' },
                { id: 'assigned', label: 'Assigned', sx: { width: '120px' } },
                { id: 'returned', label: 'Returned', sx: { width: '120px' } },
                ...(onChange
                  ? [{ id: 'actions', label: '', sx: { width: '92px' } }]
                  : []),
              ]}
            />

            <TableBody>
              {rows.map((assignment) => (
                <TableRow
                  key={assignment.id}
                  sx={{
                    transition: 'background-color 0.15s ease',
                    '&:hover': { backgroundColor: 'var(--accent-100)' },
                  }}
                >
                  <TableCell>
                    <Typography
                      className="body-regular"
                      color="var(--black)"
                      noWrap
                    >
                      {assignment.publisher}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      className="body-small-regular"
                      color="var(--grey-400)"
                      noWrap
                    >
                      {assignment.assignedOn}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      className="body-small-regular"
                      color="var(--grey-400)"
                      noWrap
                    >
                      {assignment.returnedOn ?? '–'}
                    </Typography>
                  </TableCell>

                  {onChange && (
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing="2px"
                        sx={{ justifyContent: 'flex-end' }}
                      >
                        <RowAction
                          title="Edit"
                          onClick={() => setEditing(assignment)}
                        >
                          <IconEdit
                            color="var(--accent-main)"
                            width={18}
                            height={18}
                          />
                        </RowAction>

                        <RowAction
                          title="Delete"
                          color="error"
                          onClick={() =>
                            onChange(
                              territory.assignments.filter(
                                (item) => item.id !== assignment.id
                              )
                            )
                          }
                        >
                          <IconDelete
                            color="var(--red-main)"
                            width={18}
                            height={18}
                          />
                        </RowAction>
                      </Stack>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {onChange && (
        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
          <Button
            variant="small"
            disableAutoStretch
            startIcon={<IconAdd color="var(--accent-main)" />}
            onClick={
              (() => {
                setEditing(blankAssignment());
                setAdding(true);
              }) as never
            }
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
          onClose={() => {
            setEditing(undefined);
            setAdding(false);
          }}
          onSave={(next) =>
            onChange(
              adding
                ? [...territory.assignments, next]
                : territory.assignments.map((item) =>
                    item.id === next.id ? next : item
                  )
            )
          }
        />
      )}
    </Box>
  );
};

export default TerritoryAssignments;
