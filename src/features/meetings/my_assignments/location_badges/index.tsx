import { Box } from '@mui/material';
import { LocationBadgesProps } from './index.types';
import useLocationBadges from './useLocationBadges';
import Badge from '@components/badge';

/**
 * The hall and language group badges of an assignment. Renders nothing when
 * neither applies.
 */
const LocationBadges = ({ history, sx, ...props }: LocationBadgesProps) => {
  const { hall, dataViewLabel, dataViewColor } = useLocationBadges(history);

  if (!hall && !dataViewLabel) return null;

  return (
    <Box
      {...props}
      sx={[
        { display: 'flex', flexWrap: 'wrap', gap: '4px' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {hall && <Badge text={hall} color="accent" size="small" centerContent />}

      {dataViewLabel && (
        <Badge
          text={dataViewLabel}
          color={dataViewColor}
          size="small"
          centerContent
        />
      )}
    </Box>
  );
};

export default LocationBadges;
