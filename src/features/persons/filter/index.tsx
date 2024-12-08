import { Box } from '@mui/material';
import Button from '@components/button';
import Typography from '@components/typography';
import FilterGroup from './filter_group';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useFilter from './useFilter';
import AssignmentGroup from '../assignment_group';
import Tabs from '@components/tabs';

const TabLabel = ({ label, count }: { label: string; count: number }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transform: count === 0 && 'translateX(12px)',
        transition: 'transform 0.2s',
      }}
    >
      {label}
      <LabelBadge value={count} />
    </Box>
  );
};

const LabelBadge = ({ value }: { value: number }) => (
  <Box
    sx={{
      backgroundColor: 'var(--accent-150)',
      borderRadius: 'var(--radius-s)',
      width: '24px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '24px',
      fontSize: '14px',
      opacity: value === 0 ? 0 : 1,
      transition: 'opacity 0.2s',
    }}
  >
    {value.toString()}
  </Box>
);

const PersonsFilter = () => {
  const { t } = useAppTranslation();

  const { tabletDown, mobile400Down, desktopUp } = useBreakpoints();

  const {
    filters,
    handleClearFilters,
    assignments,
    handleToggleGroup,
    filterGroups,
    handleToggleAssignment,
    checkedItems,
    handleCloseFilterMobile,
  } = useFilter();

  const tabs = [
    {
      label: (
        <TabLabel
          count={filters.length - checkedItems.length}
          label={t('tr_categories')}
        />
      ),
      Component: (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            flex: 1,
            width: '100%',
            minWidth: '120px',
          }}
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
      ),
    },
    {
      label: (
        <TabLabel count={checkedItems.length} label={t('tr_assignments')} />
      ),
      Component: (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            flex: 1,
            width: '100%',
            minWidth: '150px',
          }}
        >
          <Typography className="body-small-semibold" color="var(--grey-350)">
            {t('tr_assignments')}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: tabletDown ? '1fr' : 'repeat(2, 1fr)',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            {assignments.map((assignment) => (
              <AssignmentGroup
                sx={{ width: '100%' }}
                key={assignment.id}
                id={assignment.id}
                header={assignment.header}
                color={assignment.color}
                items={assignment.items}
                onHeaderChange={handleToggleGroup}
                onItemChange={handleToggleAssignment}
                checkedItems={checkedItems}
                male={true}
              />
            ))}
          </Box>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Typography className="h4">{t('tr_filters')}</Typography>
        {filters.length > 0 && (
          <Box
            sx={{
              borderRadius: 'var(--radius-s)',
              padding: '4px 8px',
              backgroundColor: 'var(--accent-200)',
            }}
          >
            <Typography className="label-small-medium">
              {t('tr_amountApplied', { amount: filters.length })}
            </Typography>
          </Box>
        )}
      </Box>
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
        <Tabs tabs={tabs} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '8px',
          height: '48px',
          gap: '8px',
          flexDirection: mobile400Down ? 'column' : 'row',
          padding: mobile400Down ? '42px 0' : 'unset',
        }}
      >
        {!desktopUp && (
          <Button variant="main" onClick={handleCloseFilterMobile}>
            {t('tr_search')}
          </Button>
        )}

        <Button variant="secondary" onClick={handleClearFilters}>
          {t('tr_clearAll')}
        </Button>
      </Box>
    </Box>
  );
};

export default PersonsFilter;
