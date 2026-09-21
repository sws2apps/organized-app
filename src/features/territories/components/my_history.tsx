import { useState } from 'react';
import { Box, Collapse, Stack } from '@mui/material';
import { CustomDivider, InfoNote, Typography } from '@components/index';
import IconButton from '@components/icon_button';
import { IconCollapse } from '@icons/index';
import { CURRENT_PUBLISHER } from '../helpers';
import TruncatedText from './truncated_text';
import { Territory } from '@definition/territory';

const MyHistory = ({
  territories,
  limit = 12,
}: {
  territories: Territory[];
  limit?: number;
}) => {
  const [expanded, setExpanded] = useState(false);

  const rows = territories
    .flatMap((territory) =>
      territory.assignments
        .filter(
          (assignment) =>
            assignment.publisher === CURRENT_PUBLISHER && assignment.returnedOn
        )
        .map((assignment) => ({ territory, assignment }))
    )
    .sort((a, b) => b.assignment.endMonth - a.assignment.endMonth)
    .slice(0, limit);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <CustomDivider color="var(--accent-200)" />

      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          gap: '8px',
          padding: '4px 8px 0',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Typography className="body-small-semibold" color="var(--black)">
          My previous territories
        </Typography>
        <Typography className="label-small-regular" color="var(--grey-350)">
          {rows.length}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton sx={{ padding: 0 }}>
          <IconCollapse
            color="var(--black)"
            sx={{
              transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s',
            }}
          />
        </IconButton>
      </Stack>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {rows.length === 0 && (
          <InfoNote message="No territories returned yet." />
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {rows.map(({ territory, assignment }, index) => (
            <Stack
              key={assignment.id}
              direction="row"
              spacing="12px"
              sx={{
                alignItems: 'center',
                padding: '8px',
                borderTop: index === 0 ? 'none' : '1px solid var(--accent-200)',
              }}
            >
              <Typography
                className="label-small-semibold"
                color="var(--grey-400)"
                sx={{ width: '44px', flexShrink: 0 }}
              >
                {territory.number}
              </Typography>

              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <TruncatedText
                  className="label-small-regular"
                  color="var(--grey-400)"
                  text={territory.name}
                />
              </Box>

              <Typography
                className="label-small-regular"
                color="var(--grey-350)"
                sx={{ flexShrink: 0 }}
                noWrap
              >
                {assignment.assignedOn} – {assignment.returnedOn}
              </Typography>
            </Stack>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default MyHistory;
