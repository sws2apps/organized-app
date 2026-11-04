import { Box } from '@mui/material';
import { AssignmentTitleProps } from './index.types';
import useAssignmentItem from '../assignment_item/useAssignmentItem';
import LocationBadges from '../location_badges';
import Typography from '@components/typography';

/**
 * Category icon, one-line title and, at the far end, the hall and group
 * badges. The title gives way to the badges when space runs out.
 */
const AssignmentTitle = ({ history }: AssignmentTitleProps) => {
  const { category, title } = useAssignmentItem({ history });

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        minWidth: 0,
      }}
    >
      <Box sx={{ display: 'flex', flexShrink: 0 }}>
        {category.icon(category.color)}
      </Box>

      <Typography
        className="h4"
        sx={{
          minWidth: 0,
          // centres the text line on the icon
          paddingTop: '2px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </Typography>

      <LocationBadges
        history={history}
        sx={{
          flexWrap: 'nowrap',
          flexShrink: 0,
          marginInlineStart: 'auto',
          paddingTop: '2px',
        }}
      />
    </Box>
  );
};

export default AssignmentTitle;
