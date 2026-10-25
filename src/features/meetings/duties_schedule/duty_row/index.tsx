import { Box, Stack } from '@mui/material';
import { DutyRowProps } from '@features/meetings/duties_schedule/duty_row/index.types';
import DutyName from '@features/meetings/duties_schedule/duty_name';
import PersonSelector from '@features/meetings/person_selector';
import {
  DUTY_NAME_WIDTH,
  DUTY_FIELD_MIN_WIDTH,
  DUTY_FIELD_GAP,
  dutyFieldsLayout,
} from '@features/meetings/duties_schedule/shared';

const DutyRow = ({
  duty,
  icon,
  week,
  fields = [],
  columns,
  children,
}: DutyRowProps) => {
  // a column holds one duty: its fields stack, so audio and video stay apart
  // even when they have a different amount of persons
  const groups = (columns ?? fields.map((field) => [field])).filter(
    (group) => group.length > 0
  );

  return (
    <Box
      sx={{
        containerType: 'inline-size',
        containerName: 'duty-row',
        width: '100%',
        minWidth: 0,
      }}
    >
      <Box
        role="group"
        aria-label={duty}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: 'var(--dialog-header-gap)',
          alignItems: 'start',
          [`@container duty-row (min-width: ${DUTY_NAME_WIDTH + DUTY_FIELD_MIN_WIDTH * 2 + DUTY_FIELD_GAP * 2}px)`]:
            {
              gridTemplateColumns: `${DUTY_NAME_WIDTH}px minmax(0, 1fr)`,
            },
        }}
      >
        <DutyName duty={duty} icon={icon} />

        <Stack spacing="8px" sx={{ minWidth: 0, containerType: 'inline-size' }}>
          {children}
          {groups.length > 0 && (
            <Box sx={dutyFieldsLayout(groups.length)}>
              {groups.map((group) => (
                <Box
                  key={group[0].schedule_id ?? group[0].assignment}
                  sx={{ minWidth: 0 }}
                >
                  <Stack spacing="16px">
                    {group.map((field) => (
                      <PersonSelector
                        key={field.schedule_id ?? field.assignment}
                        label={field.label}
                        week={week}
                        assignment={field.assignment}
                        type={field.type}
                        schedule_id={field.schedule_id}
                        showIcon={false}
                      />
                    ))}
                  </Stack>
                </Box>
              ))}
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default DutyRow;
