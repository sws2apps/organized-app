import { Box, Grid, Stack } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import { CleaningFieldType, CleaningRowProps } from './index.types';
import CleaningName from '../assignment_name';
import PersonSelector from '@features/meetings/person_selector';
import { CLEANING_NAME_WIDTH, cleaningFieldColumns } from '../row_layout';

const CleaningRow = ({
  duty,
  icon,
  week,
  fields = [],
  columns,
  children,
  allowedPersons,
  minFieldWidth,
}: CleaningRowProps) => {
  const { laptopDown } = useBreakpoints();

  // a column holds one duty: its fields stack, so audio and video stay apart
  // even when they have a different amount of persons
  const groups = (columns ?? fields.map((field) => [field])).filter(
    (group) => group.length > 0
  );

  const size = cleaningFieldColumns(groups.length);

  const renderFields = (group: CleaningFieldType[]) => (
    <Stack spacing="16px" sx={{ minWidth: 0 }}>
      {group.map((field) => (
        <PersonSelector
          key={field.schedule_id ?? field.assignment}
          label={field.label}
          week={week}
          assignment={field.assignment}
          type={field.type}
          schedule_id={field.schedule_id}
          showIcon={false}
          allowedPersons={allowedPersons}
        />
      ))}
    </Stack>
  );

  const content = (
    <Stack
      spacing="16px"
      sx={{
        flex: 1,
        minWidth: 0,
        width: '100%',
        containerType: minFieldWidth ? 'inline-size' : undefined,
      }}
    >
      {children}
      {groups.length > 0 &&
        (minFieldWidth ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr)',
              columnGap: '8px',
              rowGap: '16px',
              [`@container (min-width: ${minFieldWidth * 2 + 8}px)`]: {
                gridTemplateColumns: `repeat(${Math.min(2, groups.length)}, minmax(0, 1fr))`,
              },
              [`@container (min-width: ${minFieldWidth * 3 + 16}px)`]: {
                gridTemplateColumns: `repeat(${12 / size}, minmax(0, 1fr))`,
              },
            }}
          >
            {groups.map((group) => (
              <Box
                key={group[0].schedule_id ?? group[0].assignment}
                sx={{ minWidth: 0 }}
              >
                {renderFields(group)}
              </Box>
            ))}
          </Box>
        ) : (
          <Grid container columnSpacing="8px" rowSpacing="16px">
            {groups.map((group) => (
              <Grid
                key={group[0].schedule_id ?? group[0].assignment}
                size={{ mobile: 12, laptop: size }}
              >
                {renderFields(group)}
              </Grid>
            ))}
          </Grid>
        ))}
    </Stack>
  );

  if (minFieldWidth) {
    return (
      <Box
        sx={{
          containerType: 'inline-size',
          containerName: 'cleaning-row',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            rowGap: '12px',
            columnGap: '8px',
            alignItems: 'start',
            [`@container cleaning-row (min-width: ${CLEANING_NAME_WIDTH + minFieldWidth * 2 + 16}px)`]:
              {
                gridTemplateColumns: `${CLEANING_NAME_WIDTH}px minmax(0, 1fr)`,
              },
          }}
        >
          <CleaningName
            duty={duty}
            icon={icon}
            sx={{ width: '100%', minWidth: 0 }}
          />
          {content}
        </Box>
      </Box>
    );
  }

  return (
    <Stack
      spacing={laptopDown ? '12px' : '8px'}
      direction={laptopDown ? 'column' : 'row'}
      sx={{ alignItems: 'flex-start' }}
    >
      <CleaningName duty={duty} icon={icon} />
      {content}
    </Stack>
  );
};

export default CleaningRow;
