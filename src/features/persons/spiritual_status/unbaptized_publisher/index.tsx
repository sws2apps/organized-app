import { Box, Collapse } from '@mui/material';
import { UnbaptizedPublisherType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useUnbaptizedPublisher from './useUnbaptizedPublisher';
import DateHistory from '../../date_history';
import FirstReport from '../first_report';
import SpiritualStatusTitle from '../title';
import StatusHistory from '../history';

const UnbaptizedPublisher = ({
  checked,
  onChange,
  expanded,
  onExpand,
}: UnbaptizedPublisherType) => {
  const { t } = useAppTranslation();

  const {
    handleAddHistory,
    handleDeleteHistory,
    handleEndDateChange,
    handleStartDateChange,
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
        <Box
          sx={{
            marginTop: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <FirstReport />

          <StatusHistory
            active={isActive}
            onChange={handleToggleActive}
            expanded={isExpanded}
            onExpand={handleToggleExpand}
            showAdd={activeHistory.length === 0}
            onAdd={handleAddHistory}
            history={
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  marginTop: '8px',
                }}
              >
                {activeHistory.map((history, index) => (
                  <DateHistory
                    key={history.id}
                    id={history.id}
                    start_date={history.start_date}
                    end_date={history.end_date}
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
