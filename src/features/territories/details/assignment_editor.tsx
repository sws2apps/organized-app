import { useState } from 'react';
import { Box, MenuItem, Stack } from '@mui/material';
import { Button, Select, Typography } from '@components/index';
import DatePicker from '@components/date_picker';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import MenuSubHeader from '@components/menu_sub_header';
import { useBreakpoints } from '@hooks/index';
import { GROUPS, PUBLISHERS_ONLY } from '../mockData';
import { assignmentFromDates, parseDate } from '../helpers';
import { TerritoryAssignment } from '@definition/territory';

const AssignmentEditor = ({
  assignment,
  isNew = false,
  onClose,
  onSave,
}: {
  assignment: TerritoryAssignment;
  isNew?: boolean;
  onClose: VoidFunction;
  onSave: (next: TerritoryAssignment) => void;
}) => {
  const { tablet600Up } = useBreakpoints();

  const [publisher, setPublisher] = useState(assignment.publisher);
  const [assignedOn, setAssignedOn] = useState<Date | null>(
    parseDate(assignment.assignedOn) ?? new Date()
  );
  const [returnedOn, setReturnedOn] = useState<Date | null>(
    parseDate(assignment.returnedOn)
  );

  return (
    <Dialog onClose={onClose} open sx={{ padding: '24px' }}>
      <Stack spacing="4px" sx={{ width: '100%' }}>
        <Typography className="h3">
          {isNew ? 'Add assignment' : 'Edit assignment'}
        </Typography>
        <Typography className="body-small-regular" color="var(--grey-400)">
          Who worked the territory, and when it was taken and returned.
        </Typography>
      </Stack>

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
            onChange={(value) => setReturnedOn(value)}
          />
        </Box>
      </Stack>

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="main"
          disabled={!publisher}
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
