import { Box } from '@mui/material';
import { IconAdd, IconHelpFilled } from '@components/icons';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useEnrollments from './useEnrollments';
import Button from '@components/button';
import Checkbox from '@components/checkbox';
import EnrollmentItem from './enrollment_item';
import Tooltip from '@components/tooltip';
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
    hasFREnrollment,
    infirmPioneer,
    handleInfirmPioneerChange,
  } = useEnrollments();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {/* Title row: always rendered to reserve height; hidden when not applicable */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <Typography className="h2">{t('tr_enrollments')}</Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            opacity: hasFREnrollment ? 1 : 0,
            visibility: hasFREnrollment ? 'visible' : 'hidden',
            transition: 'opacity 0.15s ease, visibility 0.15s ease',
          }}
        >
          <Checkbox
            label={t('tr_infirmPioneer')}
            checked={infirmPioneer}
            onChange={(e) => handleInfirmPioneerChange(e.target.checked)}
            readOnly={!isPersonEditor}
            sx={{ margin: '4px' }}
          />
          <Tooltip
            title={t('tr_infirmPioneerDesc')}
            placement="bottom-end"
            variant="icon"
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'var(--accent-350)',
                transition: 'color 0.2s',
                '&:hover': { color: 'var(--accent-main)' },
                cursor: 'pointer',
              }}
            >
              <IconHelpFilled width={16} height={16} color="currentColor" />
            </Box>
          </Tooltip>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxHeight: '350px',
          overflow: 'auto',
          paddingTop: activeHistory.length > 0 ? '8px' : 'unset',
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
