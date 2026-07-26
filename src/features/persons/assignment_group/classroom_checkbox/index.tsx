import { useState } from 'react';
import { Box, Collapse, Stack } from '@mui/material';
import { IconExpand } from '@components/icons';
import { ClassroomCheckboxType } from './index.types';
import Checkbox from '@components/checkbox';
import IconButton from '@components/icon_button';
import SwitchWithLabel from '@components/switch_with_label';

const ClassroomCheckbox = ({
  label,
  checked,
  disabled,
  readOnly,
  onChange,
  classrooms,
  selected,
  onClassroomsChange,
  sx,
}: ClassroomCheckboxType) => {
  const [expanded, setExpanded] = useState(false);

  const showClassrooms = checked && !disabled;

  const handleClassroomToggle = (id: string, value: boolean) => {
    if (value) {
      onClassroomsChange(
        classrooms
          .map((classroom) => classroom.id)
          .filter((classroom) => classroom === id || selected.includes(classroom))
      );
    }

    if (!value) {
      const newSelected = selected.filter((classroom) => classroom !== id);

      // an assignment must remain applicable to at least one classroom
      if (newSelected.length === 0) return;

      onClassroomsChange(newSelected);
    }
  };

  return (
    <Box sx={sx}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <Checkbox
          label={label}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          className="body-small-regular"
        />

        {showClassrooms && (
          <IconButton
            sx={{ padding: 0 }}
            disableHover
            onClick={() => setExpanded((prev) => !prev)}
          >
            <IconExpand
              color="var(--black)"
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            />
          </IconButton>
        )}
      </Box>

      <Collapse in={expanded && showClassrooms} timeout="auto" unmountOnExit>
        <Stack spacing="8px" sx={{ padding: '4px 0px 8px 28px' }}>
          {classrooms.map((classroom) => (
            <SwitchWithLabel
              key={classroom.id}
              label={classroom.label}
              checked={selected.includes(classroom.id)}
              onChange={(value) => handleClassroomToggle(classroom.id, value)}
              readOnly={readOnly}
            />
          ))}
        </Stack>
      </Collapse>
    </Box>
  );
};

export default ClassroomCheckbox;
