import { territoryCampaignsState } from '@features/territories/campaigns';
import { useAppTranslation } from '@hooks/index';
import { Box, Stack } from '@mui/material';
import Tooltip from '@components/tooltip';
import { Badge } from '@components/index';
import { IconCampaign, IconCancelCicle, IconRaiseHand } from '@icons/index';
import {
  daysLabel,
  doNotCallLabel,
  olderOpenAssignments,
} from '@features/territories/helpers';
import { hasNewNote } from '@features/territories/notes';
import { categoryBadge } from '@features/territories/category_colors';
import { useAtomValue } from 'jotai';
import {
  territoriesShowDoNotCallCountState,
  territoryCategoriesState,
} from '@states/territories';
import {
  AssignmentCard,
  CARD_LABEL,
  STATUS_COLOR,
  STATUS_LABEL,
  Territory,
  TerritoryAssignment,
  TerritoryStatus,
} from '@definition/territory';

// in a tight row a badge shortens its text instead of dropping out of view;
// long names give up their space first, so short ones stay readable
const shrink = (text: string) => ({
  flexShrink: text.length > 8 ? text.length : 0.1,
  minWidth: '28px',
  overflow: 'hidden',
  '& > div': { minWidth: 0 },
  // doubled to outrank the badge text's own flex display, which hides the ellipsis
  '&& p': {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

export const StatusBadge = ({
  status,
  detail,
}: {
  status: TerritoryStatus;
  // e.g. how long it has been out, as "In work · 15 d"
  detail?: string;
}) => {
  const { t } = useAppTranslation();
  return (
    <Badge
      size="small"
      color={STATUS_COLOR[status]}
      text={[t(STATUS_LABEL[status]), detail].filter(Boolean).join(' · ')}
      filled={false}
      sx={{ width: 'fit-content', flexShrink: 0 }}
    />
  );
};

const coveredColor = (days: number) => {
  if (days > 365) return 'red';
  if (days > 182) return 'orange';
  return 'grey';
};

export const CoveredBadge = ({
  days,
  label = daysLabel(days),
}: {
  days: number;
  label?: string;
}) => {
  return (
    <Badge
      size="small"
      filled={false}
      color={coveredColor(days)}
      text={label}
      sx={{ width: 'fit-content', flexShrink: 0 }}
    />
  );
};

// a return came with a note; the mark goes once an editor opens the territory
export const NewNoteBadge = ({ territory }: { territory: Territory }) => {
  const { t } = useAppTranslation();

  if (!hasNewNote(territory)) return null;

  return (
    <Badge
      size="small"
      color="accent"
      filled={false}
      text={t('tr_territoryNewNote')}
      sx={{ width: 'fit-content', ...shrink(t('tr_territoryNewNote')) }}
    />
  );
};

export const RequestBadge = ({ territory }: { territory: Territory }) => {
  const { t } = useAppTranslation();

  if (!territory.requestedBy) return null;

  return (
    <Badge
      size="small"
      color="orange"
      filled={false}
      text={t('tr_territoryRequested')}
      icon={<IconRaiseHand color="var(--orange-dark)" />}
      sx={{ width: 'fit-content', ...shrink(t('tr_territoryRequested')) }}
    />
  );
};

export const DoNotCallBadge = ({
  territory,
  onClick,
}: {
  territory: Territory;
  onClick?: VoidFunction;
}) => {
  const count = territory.doNotCalls.length;

  if (count === 0) return null;

  const label = doNotCallLabel(count, territory.type === 'phone');

  return (
    <Tooltip title={label}>
      {/* the tooltip needs a DOM child to anchor to */}
      <Box
        aria-label={label}
        {...(onClick
          ? { component: 'button', type: 'button', onClick }
          : { role: 'img' })}
        sx={{
          width: 'fit-content',
          flexShrink: 0,
          ...(onClick && {
            display: 'block',
            padding: 0,
            border: 'none',
            background: 'none',
            borderRadius: 'var(--radius-s)',
            cursor: 'pointer',
            '&:focus-visible': { outline: 'var(--red-main) auto 1px' },
          }),
        }}
      >
        <Badge
          size="small"
          color="red"
          filled={false}
          text={String(count)}
          icon={<IconCancelCicle color="var(--red-dark)" />}
          sx={{ width: 'fit-content' }}
        />
      </Box>
    </Tooltip>
  );
};

export const ListDoNotCallBadge = ({ territory }: { territory: Territory }) => {
  const visible = useAtomValue(territoriesShowDoNotCallCountState);
  return visible ? <DoNotCallBadge territory={territory} /> : null;
};

// two devices handed it out while apart; the territory's page closes the older one
export const AssignedTwiceBadge = ({ territory }: { territory: Territory }) => {
  const { t } = useAppTranslation();

  if (olderOpenAssignments(territory.assignments).length === 0) return null;

  return (
    <Tooltip
      title={t('tr_territoryTwoOpenAssignmentsAfterASyncOpenTheTerritory')}
    >
      {/* the tooltip needs a DOM child to anchor to */}
      <Box sx={{ width: 'fit-content', minWidth: 0 }}>
        <Badge
          size="small"
          color="orange"
          filled={false}
          text={t('tr_territoryAssignedTwice')}
          sx={{
            width: 'fit-content',
            ...shrink(t('tr_territoryAssignedTwice')),
          }}
        />
      </Box>
    </Tooltip>
  );
};

// the campaign the work was filed under, by the name it had at the time
export const CampaignBadge = ({
  assignment,
}: {
  assignment: TerritoryAssignment;
}) => {
  const campaigns = useAtomValue(territoryCampaignsState);
  if (!assignment.campaign) return null;
  const name =
    (!assignment.returnedOn &&
      campaigns.find((item) => item.id === assignment.campaign?.id)?.name) ||
    assignment.campaign.name;

  return (
    <Badge
      size="small"
      color="accent"
      filled={false}
      text={name}
      icon={<IconCampaign color="var(--accent-dark)" />}
      sx={{ width: 'fit-content', ...shrink(name) }}
    />
  );
};

// how the work went out; where a row is tight the name may shorten, so it also sits in a tooltip
export const CardBadge = ({
  card,
  text = false,
}: {
  card?: AssignmentCard;
  text?: boolean;
}) => {
  const { t } = useAppTranslation();

  if (!card) return null;

  const label = t(CARD_LABEL[card]);

  const badge = (
    <Badge
      size="small"
      color="grey"
      filled={false}
      text={label}
      sx={{ width: 'fit-content', ...shrink(label) }}
    />
  );

  if (text) return badge;

  return (
    <Tooltip title={label}>
      {/* the tooltip needs a DOM child to anchor to */}
      <Box
        role="img"
        aria-label={label}
        sx={{ width: 'fit-content', minWidth: 0 }}
      >
        {badge}
      </Box>
    </Tooltip>
  );
};

export const CardLostBadge = ({ territory }: { territory: Territory }) => {
  const { t } = useAppTranslation();

  if (!territory.cardLost) return null;

  return (
    <Badge
      size="small"
      color="red"
      filled={false}
      text={t('tr_territoryReprint')}
      sx={{ width: 'fit-content', ...shrink(t('tr_territoryReprint')) }}
    />
  );
};

export const CategoryBadges = ({
  territory,
  max = Infinity,
  wrap = false,
}: {
  territory: Territory;
  max?: number;
  // onto more lines instead of shortening the names
  wrap?: boolean;
}) => {
  const categories = useAtomValue(territoryCategoriesState);

  const known = categories.filter((category) =>
    territory.categories.includes(category.id)
  );

  if (known.length === 0) return null;

  const shown = known.slice(0, max);
  const rest = known.length - shown.length;

  return (
    <Stack
      direction="row"
      sx={{
        flexShrink: 1,
        minWidth: 0,
        gap: '4px',
        ...(wrap ? { flexWrap: 'wrap' } : { overflow: 'hidden' }),
      }}
    >
      {shown.map((category) => {
        const badge = categoryBadge(category.color);

        return (
          <Badge
            key={category.id}
            size="small"
            color={badge.color}
            text={category.name}
            filled={false}
            sx={{
              width: 'fit-content',
              ...shrink(category.name),
              ...badge.sx,
            }}
          />
        );
      })}
      {rest > 0 && (
        <Tooltip
          title={known
            .slice(max)
            .map((category) => category.name)
            .join(', ')}
        >
          {/* the tooltip needs a DOM child to anchor to */}
          <Box sx={{ width: 'fit-content' }}>
            <Badge size="small" color="grey" text={`+${rest}`} filled={false} />
          </Box>
        </Tooltip>
      )}
    </Stack>
  );
};
