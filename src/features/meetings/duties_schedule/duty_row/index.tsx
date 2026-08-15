import { Grid, Stack } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import { DutyRowProps } from './index.types';
import DutyName from '../duty_name';
import PersonSelector from '@features/meetings/person_selector';
import { dutyFieldColumns } from '../shared';

const DutyRow = ({ duty, icon, week, fields = [], columns }: DutyRowProps) => {
  const { laptopDown } = useBreakpoints();

  // a column holds one duty: its fields stack, so audio and video stay apart
  // even when they have a different amount of persons
  const groups = (columns ?? fields.map((field) => [field])).filter(
    (group) => group.length > 0
  );

  const size = dutyFieldColumns(groups.length);

  return (
    <Stack
      spacing={laptopDown ? '12px' : '8px'}
      direction={laptopDown ? 'column' : 'row'}
      alignItems="flex-start"
    >
      <DutyName duty={duty} icon={icon} />

      <Stack spacing="8px" flex={1} width="100%">
        <Grid container columnSpacing="8px" rowSpacing="16px">
          {groups.map((group) => (
            <Grid
              key={group[0].schedule_id ?? group[0].assignment}
              size={{ mobile: 12, laptop: size }}
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
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
};

export default DutyRow;
