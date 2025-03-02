import { Box } from '@mui/material';
import { AuxClassGroupProps } from './index.types';
import useAuxClassGroup from './useAuxClassGroup';
import Typography from '@components/typography';

export default function AuxClassGroup(props: AuxClassGroupProps) {
  const { value } = useAuxClassGroup(props);

  if (!value) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '2px 0px',
      }}
    >
      <Typography sx={{ flex: 1 }} />
      <Box
        sx={{
          width: '210px',
          alignItems: 'center',
          padding: '4px 2px',
        }}
      >
        <Typography className="body-small-regular">[{value}]</Typography>
      </Box>
    </Box>
  );
}
