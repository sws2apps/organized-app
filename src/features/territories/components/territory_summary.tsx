import { Box, Stack } from '@mui/material';
import { Typography } from '@components/index';
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

  return (
    <Stack spacing="8px">
      <Stack spacing="4px">
        <Typography className="h2" color="var(--black)">
          Overview
        </Typography>

        {/* as tall as a badge, so marking the card lost doesn't shift the card */}
        <Stack direction="row" sx={{ ...row, minHeight: '20px' }}>
          <Typography className="body-small-regular" color="var(--grey-400)">
            {description}
          </Typography>
          <CardLostBadge territory={territory} />
          <CategoryBadges territory={territory} />
        </Stack>
      </Stack>

      {state}
    </Stack>
  );
};

export default TerritorySummary;
