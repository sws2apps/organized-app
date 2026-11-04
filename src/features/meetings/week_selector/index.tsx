import { IconClearMultiple } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useWeekSelector from '@features/meetings/week_selector/useWeekSelector';
import AssignmentsDelete from '@features/meetings/assignments_delete';
import Button from '@components/button';
import WeekSelectorPanel from '@features/meetings/week_selector/panel';
import ScrollableTabs from '@components/scrollable_tabs';

const WeekSelector = () => {
  const { t } = useAppTranslation();

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
    <WeekSelectorPanel
      title={t('tr_meetings')}
      expanded={expanded}
      sortDown={sortDown}
      onToggleExpand={handleToggleExpand}
      onToggleSort={handleToggleSort}
    >
      {openDelete && (
        <AssignmentsDelete
          meeting={meeting}
          open={openDelete}
          onClose={handleCloseDelete}
        />
      )}
      {hasWeeks && <ScrollableTabs tabs={tabs} value={activeTab} />}
      {hasWeeks && (
        <Button
          variant="small"
          startIcon={<IconClearMultiple height={20} width={20} />}
          color="red"
          onClick={handleOpenDelete}
        >
          {t('tr_assignmentsDeleteMultiple')}
        </Button>
      )}
    </WeekSelectorPanel>
  );
};
export default WeekSelector;
