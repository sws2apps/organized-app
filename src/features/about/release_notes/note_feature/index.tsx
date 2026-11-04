import { Box } from '@mui/material';
import { NoteFeatureProps } from './index.types';
import useNoteFeature from './useNoteFeature';
import Typography from '@components/typography';

const NoteFeature = (props: NoteFeatureProps) => {
  const { feature } = props;

  const { showImage, handleImageError } = useNoteFeature(props);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {showImage && (
        <Box
          sx={{
            width: { mobile: '96px', tablet: '136px' },
            flexShrink: 0,
            padding: '8px',
            borderRadius: 'var(--radius-m)',
            backgroundColor: 'var(--accent-150)',
          }}
        >
          <Box
            component="img"
            src={feature.src}
            alt=""
            onError={handleImageError}
            sx={{ display: 'block', width: '100%', height: 'auto' }}
          />
        </Box>
      )}

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography className="body-small-semibold">
          {feature.tr_title}
        </Typography>
        <Typography className="body-small-regular" color="var(--grey-400)">
          {feature.tr_desc}
        </Typography>
      </Box>
    </Box>
  );
};

export default NoteFeature;
