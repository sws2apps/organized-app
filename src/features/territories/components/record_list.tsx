import { ReactNode } from 'react';
import { Box, Stack } from '@mui/material';
import { CustomDivider, InfoNote, Typography } from '@components/index';
import { clickableRow, rowStates } from './table_styles';

type RecordItem = {
  id: string;
  title: string;
  subtitle?: string;
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
  if (items.length === 0) {
    return emptyMessage ? <InfoNote message={emptyMessage} /> : null;
  }

  return (
    <Stack spacing="4px" divider={<CustomDivider color="var(--accent-200)" />}>
      {items.map((item) => (
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
              <Typography className="body-regular" color="var(--black)" noWrap>
                {item.title}
              </Typography>
              {item.badge}
            </Stack>

            {item.subtitle && (
              <Typography
                className="body-small-regular"
                color="var(--grey-400)"
                noWrap
              >
                {item.subtitle}
              </Typography>
            )}
          </Box>

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
      ))}
    </Stack>
  );
};

export default RecordList;
