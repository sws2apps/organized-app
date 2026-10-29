import { useId } from 'react';
import { Box, Collapse } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconCollapse, IconSortDown, IconSortUp } from '@components/icons';
import Card from '@components/card';
import IconButton from '@components/icon_button';
import Typography from '@components/typography';
import { WeekSelectorPanelProps } from '@features/meetings/week_selector/panel/index.types';

const WeekSelectorPanel = ({
  title,
  expanded,
  sortDown,
  onToggleExpand,
  onToggleSort,
  children,
}: WeekSelectorPanelProps) => {
  const { t } = useAppTranslation();
  const { desktopUp } = useBreakpoints();
  const id = useId();
  return (
    <Card
      sx={{
        width: desktopUp ? 'var(--week-selector-width)' : '100%',
        maxWidth: '100%',
        minWidth: desktopUp ? 'var(--week-selector-width)' : 0,
        flexShrink: 0,
        position: desktopUp ? 'sticky' : 'static',
        top: desktopUp ? 57 : undefined,
        '& .MuiIconButton-root': {
          minWidth: 'var(--touch-target-size)',
          minHeight: 'var(--touch-target-size)',
        },
        '@media (prefers-reduced-motion: reduce)': {
          '& .MuiCollapse-root, & svg': { transition: 'none !important' },
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <Typography
          className="h2"
          sx={{ minWidth: 0, overflowWrap: 'anywhere' }}
        >
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <IconButton
            aria-label={t('tr_reverseWeekOrder')}
            aria-pressed={sortDown}
            onClick={onToggleSort}
            edge={false}
          >
            {sortDown ? (
              <IconSortDown color="var(--black)" />
            ) : (
              <IconSortUp color="var(--black)" />
            )}
          </IconButton>
          {!desktopUp && (
            <IconButton
              aria-label={t('tr_toggleWeeks')}
              aria-expanded={expanded}
              aria-controls={id}
              onClick={onToggleExpand}
              edge={false}
            >
              <IconCollapse
                color="var(--black)"
                sx={{
                  transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
                  transition:
                    'transform var(--motion-fast) var(--ease-standard)',
                }}
              />
            </IconButton>
          )}
        </Box>
      </Box>
      <Collapse id={id} in={desktopUp || expanded} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </Card>
  );
};
export default WeekSelectorPanel;
