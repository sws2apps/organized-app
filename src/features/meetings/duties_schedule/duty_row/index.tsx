import { Grid, Stack } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import { DutyRowProps } from './index.types';
import DutyName from '../duty_name';
import PersonSelector from '@features/meetings/person_selector';
import { dutyFieldColumns } from '../shared';

const DutyRow = ({ duty, icon, week, fields }: DutyRowProps) => {
  const { laptopDown } = useBreakpoints();

  const size = dutyFieldColumns(fields.length);

  return (
    <Stack
      spacing={laptopDown ? '12px' : '8px'}
      direction={laptopDown ? 'column' : 'row'}
      alignItems="flex-start"
    >
      <DutyName duty={duty} icon={icon} />

      <Stack spacing="8px" flex={1} width="100%">
        <Grid container columnSpacing="8px" rowSpacing="16px">
          {fields.map((field) => (
            <Grid
              key={field.schedule_id ?? field.assignment}
              size={{ mobile: 12, laptop: size }}
            >
              <PersonSelector
                label={field.label}
                week={week}
                assignment={field.assignment}
                type={field.type}
                schedule_id={field.schedule_id}
                showIcon={false}
              />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
};

export default DutyRow;
