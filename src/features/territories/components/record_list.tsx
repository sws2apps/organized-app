import { ReactNode } from 'react';
import { Box, Stack } from '@mui/material';
import { CustomDivider, InfoNote, Typography } from '@components/index';
import { useBreakpoints } from '@hooks/index';
import { IconChevronRight } from '@icons/index';
import {
  clickableRow,
  HOVER_ACTIONS,
  rowStates,
} from '@features/territories/components/table_styles';

type RecordItem = {
  id: string;
  title: string;
  titleColor?: string;
  subtitle?: string;
  content?: ReactNode;
  // right-aligned where there is room, otherwise the end of the subtitle
  date?: string;
  // a red line under the subtitle, e.g. dates that can't be right
  warning?: string;
  badge?: ReactNode;
  // icon buttons for a wide screen; on a phone the row itself is the button
  actions?: ReactNode;
  // what a phone shows at the end of a tappable row instead of the chevron
  trailing?: ReactNode;
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
              minHeight: tablet688Up ? undefined : '44px',
              borderRadius: 'var(--radius-m)',
              ...rowStates(false, !!item.onClick),
              ...(item.onClick && HOVER_ACTIONS),
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

              {item.content}

              {item.warning && (
                <Typography
                  className="label-small-regular"
                  color="var(--red-main)"
                >
                  {item.warning}
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

            {tablet688Up && item.actions && (
              <Stack
                direction="row"
                className="row-actions"
                onClick={(event) => event.stopPropagation()}
                sx={{ flexShrink: 0, gap: '2px' }}
              >
                {item.actions}
              </Stack>
            )}

            {!tablet688Up &&
              item.onClick &&
              (item.trailing || (
                <IconChevronRight
                  color="var(--grey-350)"
                  width={20}
                  height={20}
                  sx={{ flexShrink: 0 }}
                />
              ))}
          </Stack>
        );
      })}
    </Stack>
  );
};

export default RecordList;
