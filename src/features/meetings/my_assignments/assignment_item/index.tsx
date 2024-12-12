import { Box, Stack } from '@mui/material';
import { IconAddMonth } from '@components/icons';
import { BROTHER_ASSIGNMENT } from '@constants/index';
import { AssignmentItemProps } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useAssignmentItem from './useAssignmentItem';
import Badge from '@components/badge';
import IconButton from '@components/icon_button';
import Typography from '@components/typography';
import { AssignmentCode } from '@definition/assignment';

const AssignmentItem = ({ history }: AssignmentItemProps) => {
  const { t } = useAppTranslation();

  const {
    assignmentDate,
    isMidweek,
    personGetName,
    userUID,
    ADD_CALENDAR_SHOW,
  } = useAssignmentItem(history);

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Box
        style={{
          textAlign: 'center',
          width: '56px',
          borderRadius: 'var(--radius-m)',
          padding: '8px 4px',
          backgroundColor: isMidweek
            ? 'var(--midweek-meeting)'
            : 'var(--weekend-meeting)',
        }}
      >
        <Typography className="h2" color="var(--always-white)">
          {assignmentDate}
        </Typography>
      </Box>
      <Stack
        alignItems="center"
        justifyContent="space-between"
        direction="row"
        width="calc(100% - 72px)"
        spacing={1}
        sx={(theme) => ({
          [theme.breakpoints.up('tablet')]: {
            ':hover': {
              button: {
                backgroundColor: 'var(--accent-200)',
                opacity: 1,
                pointerEvents: 'all',
              },
            },
          },
        })}
      >
        <Stack justifyContent="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography className="h3">{history.assignment.title}</Typography>
            {!BROTHER_ASSIGNMENT.includes(history.assignment.code) &&
              history.assignment.code !== AssignmentCode.MM_Discussion && (
                <Badge
                  text="Hall A"
                  color="accent"
                  size="medium"
                  centerContent
                />
              )}
          </Stack>

          {userUID !== history.assignment.person && (
            <Badge
              size="small"
              filled
              color="orange"
              sx={{ width: 'fit-content', height: 'auto' }}
              text={t('tr_deliveredBy', {
                name: personGetName(history.assignment.person),
              })}
            />
          )}

          {history.assignment.ayf?.student && (
            <Typography
              className={'body-small-semibold'}
              color={'var(--grey-400)'}
            >
              {`${t('tr_student')}: ${personGetName(history.assignment.ayf.student)}`}
            </Typography>
          )}

          {history.assignment.ayf?.assistant && (
            <Typography
              className={'body-small-semibold'}
              color={'var(--grey-400)'}
            >
              {`${t('tr_assistant')}: ${personGetName(history.assignment.ayf.assistant)}`}
            </Typography>
          )}
          {history.assignment.src && (
            <Typography
              className={
                history.assignment.ayf
                  ? 'body-small-regular'
                  : 'body-small-semibold'
              }
              color={
                history.assignment.ayf ? 'var(--grey-350)' : 'var(--grey-400)'
              }
            >
              {history.assignment.src}
            </Typography>
          )}
          {history.assignment.desc && (
            <Typography className="body-small-regular" color="var(--grey-400)">
              {history.assignment.desc}
            </Typography>
          )}
        </Stack>

        {ADD_CALENDAR_SHOW && (
          <IconButton
            sx={(theme) => ({
              borderRadius: 'var(--radius-l)',
              [theme.breakpoints.up('tablet')]: {
                opacity: 0,
                pointerEvents: 'none',
                transition: 'opacity 500ms ease',
              },
            })}
          >
            <IconAddMonth color="var(--accent-main)" />
          </IconButton>
        )}
      </Stack>
    </Stack>
  );
};

export default AssignmentItem;
