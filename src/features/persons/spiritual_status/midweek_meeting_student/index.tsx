import { Box, Collapse } from '@mui/material';
import { IconAdd } from '@components/icons';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { MidweekMeetingStudentType } from './index.types';
import useMidweekMeetingStudent from './useMidweekMeetingStudent';
import Button from '@components/button';
import DateHistory from '../../date_history';
import SpiritualStatusTitle from '../title';

const MidweekMeetingStudent = ({
  checked,
  onChange,
  expanded,
  onExpand,
}: MidweekMeetingStudentType) => {
  const { t } = useAppTranslation();

  const { isPersonEditor } = useCurrentUser();

  const {
    handleAddHistory,
    handleDeleteHistory,
    handleEndDateChange,
    handleStartDateChange,
    activeHistory,
  } = useMidweekMeetingStudent();

  return (
    <Box>
      <SpiritualStatusTitle
        checked={checked}
        onChange={(_, checked) => onChange(checked)}
        title={t('tr_midweekMeetingStudent')}
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
          {isPersonEditor && activeHistory.length === 0 && (
            <Button
              variant="small"
              startIcon={<IconAdd />}
              sx={{
                height: '32px',
                minHeight: '32px !important',
                alignSelf: 'flex-start',
              }}
              onClick={handleAddHistory}
            >
              {t('tr_add')}
            </Button>
          )}

          {activeHistory.map((history, index) => (
            <DateHistory
              key={history.id}
              readOnly={!isPersonEditor}
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
      </Collapse>
    </Box>
  );
};

export default MidweekMeetingStudent;
