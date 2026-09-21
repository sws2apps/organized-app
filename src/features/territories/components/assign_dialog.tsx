import { useState } from 'react';
import { Box, MenuItem, Stack } from '@mui/material';
import { Button, Select, Typography } from '@components/index';
import DatePicker from '@components/date_picker';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import MenuSubHeader from '@components/menu_sub_header';
import { useBreakpoints } from '@hooks/index';
import { GROUPS, PUBLISHERS_ONLY } from '../mockData';
import { suggestedPublisher } from '../helpers';
import { Territory } from '@definition/territory';

export type AssignDialogProps = {
  title: string;
  subtitle?: string;
  requestedBy?: string;
  territories: Territory[];
  onClose: VoidFunction;
  onAssign: (publisher: string, assignedOn: Date) => void;
};

const AssignDialog = ({
  title,
  subtitle,
  requestedBy,
  territories,
  onClose,
  onAssign,
}: AssignDialogProps) => {
  const { tablet600Up } = useBreakpoints();

  const [publisher, setPublisher] = useState(
    requestedBy ?? suggestedPublisher(territories)
  );
  const [assignedOn, setAssignedOn] = useState<Date | null>(new Date());

  return (
    <Dialog onClose={onClose} open sx={{ padding: '24px' }}>
      <Stack spacing="4px" sx={{ width: '100%' }}>
        <Typography className="h3">{title}</Typography>
        {subtitle && (
          <Typography className="body-small-regular" color="var(--grey-400)">
            {subtitle}
          </Typography>
        )}
      </Stack>

      <Stack
        direction={tablet600Up ? 'row' : 'column'}
        spacing="16px"
        sx={{ width: '100%' }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
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
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <DatePicker
            label="Assigned on"
            value={assignedOn}
            onChange={(value) => setAssignedOn(value)}
          />
        </Box>
      </Stack>

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="main"
          onClick={() => {
            onAssign(publisher, assignedOn ?? new Date());
            onClose();
          }}
        >
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignDialog;
