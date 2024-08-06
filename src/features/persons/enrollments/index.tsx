import { Box } from '@mui/material';
import { IconAdd } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useEnrollments from './useEnrollments';
import Button from '@components/button';
import EnrollmentItem from './enrollment_item';
import Typography from '@components/typography';

const Enrollments = () => {
  const { t } = useAppTranslation();

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
        {activeHistory.length === 0 && (
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
            id={history.id}
            enrollment={history.enrollment.value}
            start_date={history.start_date.value}
            end_date={history.end_date.value}
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

export default Enrollments;
