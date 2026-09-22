import { Box, Stack } from '@mui/material';
import { Badge, Typography } from '@components/index';
import { Territory, TYPE_LABEL } from '@definition/territory';
import { CardLostBadge, CategoryBadges, StatusBadge } from './territory_badges';

const TerritorySummary = ({
  territory,
  meta,
  heading = false,
}: {
  territory: Territory;
  meta?: string;
  // the territory's number and name as the card's title, locality underneath
  heading?: boolean;
}) => {
  const title = [territory.number, territory.name].filter(Boolean).join(' · ');

  const badges = (
    <Stack
      direction="row"
      sx={{ alignItems: 'center', flexWrap: 'wrap', gap: '8px', minWidth: 0 }}
    >
      {heading && territory.city && (
        <Typography className="body-small-regular" color="var(--grey-400)">
          {territory.city}
        </Typography>
      )}

      <Box sx={{ width: 'fit-content' }}>
        <StatusBadge status={territory.status} />
      </Box>

      <Box sx={{ width: 'fit-content' }}>
        <Badge
          size="small"
          filled={false}
          color="grey"
          text={TYPE_LABEL[territory.type]}
        />
      </Box>

      {heading && <CardLostBadge territory={territory} />}
      {heading && <CategoryBadges territory={territory} />}

      {meta && (
        <Typography className="label-small-regular" color="var(--grey-350)">
          {meta}
        </Typography>
      )}
    </Stack>
  );

  if (!heading) return badges;

  // always there, so typing the first letter doesn't push the card down
  return (
    <Stack spacing="4px">
      <Typography
        component="h2"
        className="h3"
        color={title ? 'var(--black)' : 'var(--grey-350)'}
      >
        {title || 'New territory'}
      </Typography>
      {badges}
    </Stack>
  );
};

export default TerritorySummary;
