import { KeyboardEvent } from 'react';
import { Box } from '@mui/material';
import { IconPerson } from '@components/icons';
import { AssignmentItemProps } from './index.types';
import useAssignmentItem from './useAssignmentItem';
import AssignmentTitle from '../assignment_title';
import Badge from '@components/badge';
import Typography from '@components/typography';

const AssignmentItem = ({ history, onOpen }: AssignmentItemProps) => {
  const { details, delegate } = useAssignmentItem({ history });

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    onOpen(history);
  };

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={() => onOpen(history)}
      onKeyDown={handleKeyDown}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        padding: '8px',
        // fits the title and one details line, so the date beside the row
        // never hangs below it
        minHeight: '56px',
        borderRadius: 'var(--radius-m)',
        cursor: 'pointer',
        transition: 'background-color 0.15s',
        '&:hover': { backgroundColor: 'var(--accent-150)' },
        '&:active': { backgroundColor: 'var(--accent-200)' },
        '&:focus-visible': {
          outline: '2px solid var(--accent-main)',
          outlineOffset: '-2px',
        },
      }}
    >
      <AssignmentTitle history={history} />

      {details.map((detail) => (
        <Typography
          key={detail}
          className="body-small-regular"
          color="var(--grey-400)"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {detail}
        </Typography>
      ))}

      {delegate && (
        <Box sx={{ display: 'flex', marginTop: '2px' }}>
          <Badge
            text={delegate}
            icon={<IconPerson />}
            color="orange"
            size="small"
            filled
          />
        </Box>
      )}
    </Box>
  );
};

export default AssignmentItem;
