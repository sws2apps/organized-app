import { Box, Collapse } from '@mui/material';
import DateHistory from '../../date_history';
import SpiritualStatusTitle from '../title';
import { UnbaptizedPublisherType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useUnbaptizedPublisher from './useUnbaptizedPublisher';
import FirstReport from '../first_report';
import StatusHistory from '../history';

const UnbaptizedPublisher = ({ checked, onChange, expanded, onExpand }: UnbaptizedPublisherType) => {
  const { t } = useAppTranslation();

  const {
    person,
    handleAddHistory,
    handleDeleteHistory,
    handleEndDateChange,
    handleStartDateChange,
    handleFirstReportChange,
    activeHistory,
    handleToggleActive,
    handleToggleExpand,
    isActive,
    isExpanded,
  } = useUnbaptizedPublisher();

  return (
    <Box>
      <SpiritualStatusTitle
        checked={checked}
        onChange={(_, checked) => onChange(checked)}
        title={t('tr_unbaptizedPublisher')}
        isExpanded={expanded}
        onExpand={onExpand}
      />

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FirstReport value={person.firstMonthReport.value} onChange={handleFirstReportChange} />

          <StatusHistory
            active={isActive}
            onChange={handleToggleActive}
            expanded={isExpanded}
            onExpand={handleToggleExpand}
            showAdd={activeHistory.length === 0}
            onAdd={handleAddHistory}
            history={
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
                {activeHistory.map((history, index) => (
                  <DateHistory
                    key={history.id}
                    id={history.id}
                    startDate={history.startDate.value}
                    endDate={history.endDate.value}
                    isLast={index === activeHistory.length - 1}
                    onAdd={handleAddHistory}
                    onDelete={handleDeleteHistory}
                    onStartDateChange={handleStartDateChange}
                    onEndDateChange={handleEndDateChange}
                  />
                ))}
              </Box>
            }
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default UnbaptizedPublisher;
