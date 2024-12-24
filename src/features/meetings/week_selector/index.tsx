import { Box, Collapse } from '@mui/material';
import {
  IconClearMultiple,
  IconCollapse,
  IconSortDown,
  IconSortUp,
} from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useWeekSelector from './useWeekSelector';
import AssignmentsDelete from '../assignments_delete';
import Button from '@components/button';
import Typography from '@components/typography';
import ScrollableTabs from '@components/scrollable_tabs';

const WeekSelector = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const {
    tabs,
    hasWeeks,
    expanded,
    handleToggleExpand,
    activeTab,
    handleCloseDelete,
    openDelete,
    handleOpenDelete,
    meeting,
    sortDown,
    handleToggleSort,
  } = useWeekSelector();

  return (
    <Box
      sx={{
        width: desktopUp ? '360px' : '100%',
        flexShrink: 0,
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--accent-300)',
        backgroundColor: 'var(--white)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: desktopUp ? 'sticky' : 'unset',
        top: desktopUp ? 57 : 'unset',
      }}
    >
      {openDelete && (
        <AssignmentsDelete
          meeting={meeting}
          open={openDelete}
          onClose={handleCloseDelete}
        />
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: desktopUp ? 'default' : 'pointer',
        }}
        onClick={desktopUp ? null : handleToggleExpand}
      >
        <Typography className="h2">{t('tr_meetingWeeks')}</Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <Box
            onClick={(e) => {
              e.stopPropagation();
              handleToggleSort();
            }}
          >
            {sortDown ? (
              <IconSortDown color="var(--black)" />
            ) : (
              <IconSortUp color="var(--black)" />
            )}
          </Box>
          {!desktopUp && (
            <IconCollapse
              color="var(--black)"
              sx={{
                transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.3s',
              }}
            />
          )}
        </Box>
      </Box>

      <Collapse in={desktopUp || expanded} timeout="auto" unmountOnExit>
        {hasWeeks && <ScrollableTabs tabs={tabs} value={activeTab} />}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: hasWeeks ? 'space-between' : 'flex-end',
          }}
        >
          {hasWeeks && (
            <Button
              variant="small"
              startIcon={<IconClearMultiple height={20} width={20} />}
              sx={{ height: '32px', minHeight: '32px' }}
              color="red"
              onClick={handleOpenDelete}
            >
              {t('tr_assignmentsDeleteMultiple')}
            </Button>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default WeekSelector;
