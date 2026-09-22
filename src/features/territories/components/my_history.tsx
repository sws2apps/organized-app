import { Box, Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import { CustomDivider, InfoNote, Typography } from '@components/index';
import { CURRENT_PUBLISHER, displayDate, parseDate } from '../helpers';
import TruncatedText from './truncated_text';
import { Territory } from '@definition/territory';
import { shortDateFormatState } from '@states/settings';

const MyHistory = ({ territories }: { territories: Territory[] }) => {
  const format = useAtomValue(shortDateFormatState);

  const rows = territories
    .flatMap((territory) =>
      territory.assignments
        .filter(
          (assignment) =>
            assignment.publisher === CURRENT_PUBLISHER && assignment.returnedOn
        )
        .map((assignment) => ({ territory, assignment }))
    )
    .sort(
      (a, b) =>
        (parseDate(b.assignment.returnedOn)?.getTime() ?? 0) -
        (parseDate(a.assignment.returnedOn)?.getTime() ?? 0)
    )
    .slice(0, 12);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Stack direction="row" sx={{ alignItems: 'center', gap: '8px' }}>
        <Typography className="body-small-semibold" color="var(--black)">
          My previous territories
        </Typography>
        <Typography className="label-small-regular" color="var(--grey-350)">
          {rows.length}
        </Typography>
      </Stack>

      {rows.length === 0 && <InfoNote message="No territories returned yet." />}

      <Stack
        spacing="4px"
        divider={<CustomDivider color="var(--accent-200)" />}
      >
        {rows.map(({ territory, assignment }) => (
          <Stack
            key={assignment.id}
            direction="row"
            spacing="12px"
            sx={{ alignItems: 'center', padding: '8px' }}
          >
            <Typography
              className="body-small-semibold"
              color="var(--black)"
              sx={{ width: '48px', flexShrink: 0 }}
            >
              {territory.number}
            </Typography>

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <TruncatedText
                className="label-small-regular"
                color="var(--black)"
                text={territory.name}
              />
            </Box>

            <Typography
              className="label-small-regular"
              color="var(--grey-350)"
              sx={{ flexShrink: 0 }}
              noWrap
            >
              {displayDate(assignment.assignedOn, format)} –{' '}
              {displayDate(assignment.returnedOn, format)}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default MyHistory;
