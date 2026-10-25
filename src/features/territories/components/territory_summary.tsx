import { useAppTranslation } from '@hooks/index';
import { Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router';
import { Typography } from '@components/index';
import { IconArrowLink, IconPerson } from '@icons/index';
import { Territory, TYPE_LABEL } from '@definition/territory';
import {
  CardLostBadge,
  CategoryBadges,
  DoNotCallBadge,
  StatusBadge,
} from '@features/territories/components/territory_badges';

const row = {
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '8px',
  minWidth: 0,
} as const;

const TerritorySummary = ({
  territory,
  meta,
  holder,
  heading = false,
  showDoNotCalls = false,
  onDoNotCalls,
}: {
  territory: Territory;
  meta?: string;
  // the holder's name in meta, which opens all their territories
  holder?: string;
  heading?: boolean;
  showDoNotCalls?: boolean;
  onDoNotCalls?: VoidFunction;
}) => {
  const { t } = useAppTranslation();

  const navigate = useNavigate();
  const ownsMeta = !!holder && !!meta?.startsWith(holder);
  // how long it's out joins the status badge; the holder gets a badge of
  // their own
  const days = ownsMeta
    ? meta!.slice(holder!.length).replace(/^\s*·\s*/, '')
    : undefined;

  const description = [heading && territory.city, t(TYPE_LABEL[territory.type])]
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

  // the badges sit top right, centred on the title; the holder wraps under
  // the description on a phone
  return (
    <Stack spacing="4px">
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <Typography className="h2" color="var(--black)" sx={{ minWidth: 0 }}>
          {t('tr_territoryOverview')}
        </Typography>

        <Stack
          direction="row"
          sx={{ alignItems: 'center', gap: '6px', flexShrink: 0 }}
        >
          {showDoNotCalls && (
            <DoNotCallBadge territory={territory} onClick={onDoNotCalls} />
          )}
          <StatusBadge status={territory.status} detail={days} />
        </Stack>
      </Stack>

      <Stack
        direction="row"
        sx={{
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '4px 16px',
        }}
      >
        {/* as tall as a badge, so marking the card lost doesn't shift the card */}
        <Stack direction="row" sx={{ ...row, minHeight: '20px' }}>
          <Typography className="body-small-regular" color="var(--grey-400)">
            {description}
          </Typography>
          <CardLostBadge territory={territory} />
          <CategoryBadges territory={territory} wrap />
        </Stack>

        {ownsMeta && (
          <Stack direction="row" sx={{ alignItems: 'center', gap: '6px' }}>
            <Box
              component="button"
              type="button"
              className="label-small-medium"
              title={t('tr_territoryShowAllTheirTerritories')}
              onClick={() =>
                navigate(
                  `/territories?tab=all&search=${encodeURIComponent(holder)}`
                )
              }
              sx={{
                all: 'unset',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px 2px 6px',
                borderRadius: 'var(--radius-s)',
                backgroundColor: 'var(--accent-150)',
                color: 'var(--accent-dark)',
                cursor: 'pointer',
                transition: 'background-color 0.15s',
                '& svg path': { fill: 'currentColor' },
                // the arrow slides in on hover: it opens their territories
                '& .holder-arrow': {
                  display: 'inline-flex',
                  width: 0,
                  marginLeft: '-4px',
                  opacity: 0,
                  overflow: 'hidden',
                  transition:
                    'width 0.2s cubic-bezier(0.22, 1, 0.36, 1), margin 0.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.15s',
                },
                '&:hover, &:focus-visible': {
                  backgroundColor: 'var(--accent-200)',
                  '& .holder-arrow': {
                    width: '14px',
                    marginLeft: 0,
                    opacity: 1,
                  },
                },
                '&:focus-visible': {
                  outline: '2px solid var(--accent-main)',
                  outlineOffset: '2px',
                },
                '@media (prefers-reduced-motion: reduce)': {
                  '&, & .holder-arrow': { transition: 'none' },
                },
              }}
            >
              <IconPerson width={14} height={14} />
              {holder}
              <Box component="span" className="holder-arrow">
                <IconArrowLink width={14} height={14} />
              </Box>
            </Box>
          </Stack>
        )}

        {meta && !ownsMeta && (
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
