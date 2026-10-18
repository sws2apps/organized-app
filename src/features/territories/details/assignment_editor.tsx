import { useState } from 'react';
import { Box, MenuItem, Stack } from '@mui/material';
import { Button, InfoNote, Select, Typography } from '@components/index';
import DatePicker from '@components/date_picker';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import MenuSubHeader from '@components/menu_sub_header';
import { useBreakpoints } from '@hooks/index';
import { GROUPS, PUBLISHERS_ONLY } from '../mockData';
import { assignmentFromDates, parseDate } from '../helpers';
import EditorHeader from './editor_header';
import { TerritoryAssignment } from '@definition/territory';

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const AssignmentEditor = ({
  assignment,
  isNew = false,
  otherOpen = false,
  onClose,
  onSave,
  onDelete,
}: {
  assignment: TerritoryAssignment;
  isNew?: boolean;
  otherOpen?: boolean;
  onClose: VoidFunction;
  onSave: (next: TerritoryAssignment) => void;
  onDelete?: VoidFunction;
}) => {
  const { tablet600Up } = useBreakpoints();

  const [publisher, setPublisher] = useState(assignment.publisher);
  const [assignedOn, setAssignedOn] = useState<Date | null>(
    parseDate(assignment.assignedOn) ?? new Date()
  );
  const [returnedOn, setReturnedOn] = useState<Date | null>(
    parseDate(assignment.returnedOn)
  );

  const returnedTooEarly =
    !!assignedOn &&
    !!returnedOn &&
    startOfDay(returnedOn) < startOfDay(assignedOn);

  const secondOpen = otherOpen && !returnedOn;

  return (
    <Dialog
      onClose={onClose}
      open
      header={
        <EditorHeader
          title={isNew ? 'Add assignment' : 'Edit assignment'}
          description="Who worked the territory, and when it was taken and returned."
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
      <Select
        label="Publisher"
        value={publisher}
        onChange={(event) => setPublisher(event.target.value as string)}
      >
        <MenuSubHeader>Groups</MenuSubHeader>
        {GROUPS.map((name) => (
          <MenuItem key={name} value={name}>
            <Typography className="body-regular">{name}</Typography>
          </MenuItem>
        ))}

        <MenuSubHeader>Publishers</MenuSubHeader>
        {PUBLISHERS_ONLY.map((name) => (
          <MenuItem key={name} value={name}>
            <Typography className="body-regular">{name}</Typography>
          </MenuItem>
        ))}
      </Select>

      <Stack
        direction={tablet600Up ? 'row' : 'column'}
        spacing="16px"
        sx={{ width: '100%' }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <DatePicker
            label="Assigned on"
            value={assignedOn}
            onChange={(value) => setAssignedOn(value)}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <DatePicker
            label="Returned on"
            value={returnedOn}
            minDate={assignedOn}
            error={returnedTooEarly}
            helperText={
              returnedTooEarly ? 'Cannot be before the assigned date' : ''
            }
            onChange={(value) => setReturnedOn(value)}
          />
        </Box>
      </Stack>

      {secondOpen && (
        <InfoNote message="The territory is already out with someone. Add a returned date, or return the open assignment first." />
      )}

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="main"
          disabled={!publisher || returnedTooEarly || secondOpen}
          onClick={() => {
            onSave(
              assignmentFromDates(
                assignment,
                publisher,
                assignedOn ?? new Date(),
                returnedOn
              )
            );
            onClose();
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignmentEditor;
