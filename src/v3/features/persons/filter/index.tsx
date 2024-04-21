import { Box, Collapse } from '@mui/material';
import { IconExpand } from '@components/icons';
import Button from '@components/button';
import Typography from '@components/typography';
import FilterGroup from './filter_group';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useFilter from './useFilter';
import AssignmentGroup from '../assignment_group';

const PersonsFilter = () => {
  const { t } = useAppTranslation();

  const { tabletDown } = useBreakpoints();

  const {
    isExpanded,
    handleExpand,
    filters,
    handleClearFilters,
    assignments,
    handleToggleGroup,
    filterGroups,
    handleToggleAssignment,
    checkedItems,
  } = useFilter();

  return (
    <Box
      sx={{
        border: '1px solid var(--accent-350)',
        padding: '16px',
        borderRadius: 'var(--radius-l)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={handleExpand}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Typography className="h4">{t('tr_filters')}</Typography>
          {filters.length > 0 && (
            <Box sx={{ borderRadius: 'var(--radius-s)', padding: '4px 8px', backgroundColor: 'var(--accent-200)' }}>
              <Typography className="label-small-medium">
                {t('tr_amountApplied', { amount: filters.length })}
              </Typography>
            </Box>
          )}
        </Box>

        <IconExpand
          color="var(--black)"
          sx={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
        />
      </Box>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            marginTop: '16px',
            justifyContent: 'space-between',
            flexDirection: tabletDown ? 'column' : 'row',
          }}
        >
          <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, width: '100%', minWidth: '120px' }}
          >
            {filterGroups.map((group) => (
              <FilterGroup
                key={group.name}
                group={{
                  name: group.name,
                  items: group.items,
                }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, width: '100%', minWidth: '150px' }}>
            <Typography className="body-small-semibold" color="var(--grey-350)">
              {t('tr_assignments')}
            </Typography>
            <Box sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {assignments.map((assignment) => (
                <AssignmentGroup
                  key={assignment.id}
                  id={assignment.id}
                  header={assignment.header}
                  color={assignment.color}
                  items={assignment.items}
                  onHeaderChange={handleToggleGroup}
                  onItemChange={handleToggleAssignment}
                  checkedItems={checkedItems}
                  isMale={true}
                />
              ))}
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '8px', height: '48px' }}>
          <Button variant="secondary" onClick={handleClearFilters}>
            {t('tr_clearAll')}
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};

export default PersonsFilter;
