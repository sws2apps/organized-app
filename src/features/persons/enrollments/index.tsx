import { Box } from '@mui/material';
import { IconAdd } from '@components/icons';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useEnrollments from './useEnrollments';
import Button from '@components/button';
import EnrollmentItem from './enrollment_item';
import Typography from '@components/typography';

const PersonEnrollments = () => {
  const { t } = useAppTranslation();

  const { isPersonEditor } = useCurrentUser();

  const {
    activeHistory,
    handleAddHistory,
    handleDeleteHistory,
    handleEndDateChange,
    handleStartDateChange,
    handleEnrollmentChange,
  } = useEnrollments();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <Typography className="h2">{t('tr_enrollments')}</Typography>

      <Box
        sx={{
          marginTop: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {isPersonEditor && activeHistory.length === 0 && (
          <Button
            variant="small"
            startIcon={<IconAdd />}
            onClick={handleAddHistory}
            sx={{
              height: '32px',
              minHeight: '32px !important',
              alignSelf: 'flex-start',
            }}
          >
            {t('tr_add')}
          </Button>
        )}

        {activeHistory.map((history, index) => (
          <EnrollmentItem
            key={history.id}
            readOnly={!isPersonEditor}
            id={history.id}
            enrollment={history.enrollment}
            start_date={history.start_date}
            end_date={history.end_date}
            isLast={index === activeHistory.length - 1}
            onAdd={handleAddHistory}
            onDelete={handleDeleteHistory}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            onEnrollmentChange={handleEnrollmentChange}
          />
        ))}
      </Box>
    </Box>
  );
};

export default PersonEnrollments;
