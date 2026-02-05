import { Box } from '@mui/material';
import { IconAdd } from '@components/icons';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useWeeksList from './useWeeksList';
import Button from '@components/button';
import WeekItem from '../week_item';

const WeeksList = () => {
  const { t } = useAppTranslation();

  const { isAdmin } = useCurrentUser();

  const { handleAddVisit, handleVisitDeleted, handleWeekChange, weeks, errors } =
    useWeeksList();

  const requiredFieldMessage = t('tr_fillRequiredField');
  const duplicateWeekMessage = t('tr_dateAlreadyExists');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginTop: '8px',
      }}
    >
      {weeks.map((visit) => {
        const errorType = errors[visit.id];

        return (
          <WeekItem
            key={visit.id}
            visit={visit}
            error={Boolean(errorType)}
            helperText={
              errorType === 'empty'
                ? requiredFieldMessage
                : errorType === 'duplicate'
                  ? duplicateWeekMessage
                  : undefined
            }
            onWeekChange={handleWeekChange}
            onDelete={handleVisitDeleted}
          />
        );
      })}

      {isAdmin && (
        <Button
          variant="small"
          sx={{
            alignSelf: 'flex-start',
            minHeight: '32px',
          }}
          startIcon={<IconAdd />}
          onClick={handleAddVisit}
        >
          {t('tr_addNextVisit')}
        </Button>
      )}
    </Box>
  );
};

export default WeeksList;
