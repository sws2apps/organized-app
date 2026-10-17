import { Box, Stack } from '@mui/material';
import { Typography } from '@components/index';
import { IconPerson } from '@icons/index';
import { Territory, TYPE_LABEL } from '@definition/territory';
import { CardLostBadge, CategoryBadges, StatusBadge } from './territory_badges';

const row = {
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '8px',
  minWidth: 0,
} as const;

const TerritorySummary = ({
  territory,
  meta,
  heading = false,
}: {
  territory: Territory;
  meta?: string;
  heading?: boolean;
}) => {
  const description = [heading && territory.city, TYPE_LABEL[territory.type]]
    .filter(Boolean)
    .join(' · ');

  const state = (
    <Stack direction="row" sx={row}>
      <Box sx={{ width: 'fit-content' }}>
        <StatusBadge status={territory.status} />
      </Box>

      {meta && (
        <Typography className="label-small-regular" color="var(--grey-400)">
          {meta}
        </Typography>
      )}
    </Stack>
  );

  if (!heading) {
    return (
      <Stack direction="row" sx={row}>
        {state}
        <Typography className="label-small-regular" color="var(--grey-350)">
          {description}
        </Typography>
      </Stack>
    );
  }

  // the status pairs with the title, the holder with the details; on a phone the holder takes its own line
  return (
    <Stack spacing="4px">
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <Typography className="h2" color="var(--black)">
          Overview
        </Typography>
        <Box sx={{ width: 'fit-content', flexShrink: 0 }}>
          <StatusBadge status={territory.status} />
        </Box>
      </Stack>

      <Stack
        direction="row"
        sx={{
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '6px 16px',
        }}
      >
        {/* as tall as a badge, so marking the card lost doesn't shift the card */}
        <Stack direction="row" sx={{ ...row, minHeight: '20px' }}>
          <Typography className="body-small-regular" color="var(--grey-400)">
            {description}
          </Typography>
          <CardLostBadge territory={territory} />
          <CategoryBadges territory={territory} />
        </Stack>

        {meta && (
          <Stack direction="row" sx={{ alignItems: 'center', gap: '4px' }}>
            <IconPerson color="var(--grey-400)" width={16} height={16} />
            <Typography className="label-small-regular" color="var(--grey-400)">
              {meta}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default TerritorySummary;
