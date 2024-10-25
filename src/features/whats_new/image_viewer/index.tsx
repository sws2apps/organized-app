import { Box } from '@mui/material';
import { ImageViewerProps } from './index.types';
import Typography from '@components/typography';

const ImageViewer = ({ current, slides }: ImageViewerProps) => {
  return (
    <>
      <Box
        sx={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          borderRadius: 'var(--radius-l)',
          backgroundColor: 'var(--accent-150)',
          width: '100%',
          height: '340px',
        }}
      >
        <Box
          component="img"
          src={slides[current].src}
          sx={{ height: '200px', width: 'auto' }}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            textAlign: 'center',
          }}
        >
          <Typography className="h4" color="var(--accent-dark)">
            {slides[current].tr_title}
          </Typography>
          <Typography className="body-small-regular" color="var(--accent-400)">
            {slides[current].tr_desc}
          </Typography>
        </Box>
      </Box>

      {slides.length > 1 && (
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {slides.map((item, index) => (
            <Box
              key={item.tr_title}
              sx={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor:
                  current === index
                    ? 'var(--accent-main)'
                    : 'var(--accent-200)',
              }}
            />
          ))}
        </Box>
      )}
    </>
  );
};

export default ImageViewer;
