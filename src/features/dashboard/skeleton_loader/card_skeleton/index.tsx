import { Box, Skeleton } from '@mui/material';
import { DashboardCardSkeletonProps } from './index.types';

// varied label lengths, so the rows do not read as one repeated block
const LABEL_WIDTHS = ['62%', '48%', '70%', '54%', '66%'];

const placeholderSx = { background: 'var(--accent-200)' };

/**
 * Mirrors the dashboard card: same height, header block and 48px menu rows.
 */
const DashboardCardSkeleton = ({ rows }: DashboardCardSkeletonProps) => {
  return (
    <Box
      className="big-card-shadow"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: { mobile: 'auto', tablet688: '336px' },
        minWidth: '300px',
        padding: '8px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--accent-200)',
        background: 'var(--white)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: '16px 0',
          borderRadius: 'var(--radius-m)',
          background: 'var(--accent-200)',
        }}
      >
        <Skeleton
          variant="rounded"
          width={128}
          height={24}
          sx={{ background: 'var(--accent-300)' }}
        />
      </Box>

      <Box sx={{ marginTop: '8px' }}>
        {LABEL_WIDTHS.slice(0, rows).map((width, index) => (
          <Box
            key={width}
            sx={{
              padding: index === rows - 1 ? '4px 0 0' : '4px 0',
              borderBottom:
                index === rows - 1 ? 'none' : '1px solid var(--accent-200)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                minHeight: '40px',
                padding: '8px 8px 8px 16px',
              }}
            >
              <Skeleton
                variant="circular"
                width={24}
                height={24}
                sx={placeholderSx}
              />
              <Skeleton
                variant="rounded"
                width={width}
                height={16}
                sx={{ ...placeholderSx, borderRadius: 'var(--radius-max)' }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DashboardCardSkeleton;
