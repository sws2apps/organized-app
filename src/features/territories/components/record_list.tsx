import { ReactNode } from 'react';
import { Box, Stack } from '@mui/material';
import { CustomDivider, InfoNote, Typography } from '@components/index';
import { useBreakpoints } from '@hooks/index';
import { clickableRow, rowStates } from './table_styles';

type RecordItem = {
  id: string;
  title: string;
  titleColor?: string;
  subtitle?: string;
  // right-aligned where there is room, otherwise the end of the subtitle
  date?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  onClick?: VoidFunction;
};

const RecordList = ({
  items,
  emptyMessage,
}: {
  items: RecordItem[];
  emptyMessage?: string;
}) => {
  const { tablet688Up } = useBreakpoints();

  if (items.length === 0) {
    return emptyMessage ? <InfoNote message={emptyMessage} /> : null;
  }

  return (
    <Stack spacing="4px" divider={<CustomDivider color="var(--accent-200)" />}>
      {items.map((item) => {
        const subtitle = tablet688Up
          ? item.subtitle
          : [item.subtitle, item.date].filter(Boolean).join(' · ');

        return (
          <Stack
            key={item.id}
            direction="row"
            {...(item.onClick ? clickableRow(item.onClick) : {})}
            sx={{
              alignItems: 'center',
              gap: '12px',
              padding: '10px 8px',
              borderRadius: 'var(--radius-m)',
              ...rowStates(false, !!item.onClick),
              // the whole row opens the editor, so a mouse only needs the icon on hover
              ...(item.onClick && {
                '@media (hover: hover) and (pointer: fine)': {
                  '& .row-actions': {
                    opacity: 0,
                    transition: 'opacity 0.15s ease',
                  },
                  '&:hover .row-actions, &:focus-within .row-actions': {
                    opacity: 1,
                  },
                },
              }),
            }}
          >
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Stack direction="row" sx={{ alignItems: 'center', gap: '8px' }}>
                <Typography
                  className="body-small-semibold"
                  color={item.titleColor ?? 'var(--black)'}
                  noWrap
                >
                  {item.title}
                </Typography>
                {item.badge}
              </Stack>

              {subtitle && (
                <Typography
                  className="body-small-regular"
                  color="var(--grey-400)"
                  noWrap
                >
                  {subtitle}
                </Typography>
              )}
            </Box>

            {tablet688Up && item.date && (
              <Typography
                className="body-small-regular"
                color="var(--grey-400)"
                sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
              >
                {item.date}
              </Typography>
            )}

            {item.actions && (
              <Stack
                direction="row"
                className="row-actions"
                onClick={(event) => event.stopPropagation()}
                sx={{ flexShrink: 0, gap: '2px' }}
              >
                {item.actions}
              </Stack>
            )}
          </Stack>
        );
      })}
    </Stack>
  );
};

export default RecordList;
