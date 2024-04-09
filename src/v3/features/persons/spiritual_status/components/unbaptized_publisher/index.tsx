import { Box, Collapse } from '@mui/material';
import { IconAdd } from '@components/icons';
import Button from '@components/button';
import DateHistory from '../../../date_history';
import SpiritualStatusTitle from '../title';
import { UnbaptizedPublisherType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useUnbaptizedPublisher from './useUnbaptizedPublisher';
import FirstReport from '../first_report';

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

          {activeHistory.length === 0 && (
            <Button
              variant="small"
              startIcon={<IconAdd />}
              sx={{ height: '32px', minHeight: '32px !important', alignSelf: 'flex-start' }}
              onClick={handleAddHistory}
            >
              {t('tr_add')}
            </Button>
          )}

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
      </Collapse>
    </Box>
  );
};

export default UnbaptizedPublisher;
