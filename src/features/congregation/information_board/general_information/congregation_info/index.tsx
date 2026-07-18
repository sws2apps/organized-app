import Card from '@components/card';
import Typography from '@components/typography';
import { Box } from '@mui/material';
import useCongregationInfo from './useCongregationInfo';
import IconButton from '@components/icon_button';
import { IconSettings } from '@components/icons';
import Divider from '@components/divider';
import useCurrentUser from '@hooks/useCurrentUser';

const CongregationInfo = () => {
  const { isAdmin } = useCurrentUser();
  const { congName, congAddress } = useCongregationInfo();

  return (
    <Card sx={{ padding: '24px' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '16px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <Typography className="h1">{congName}</Typography>
          <Typography className="body-regular" color="var(--grey-400)">
            {congAddress}
          </Typography>
        </Box>
        {isAdmin && (
          <IconButton>
            <IconSettings color="var(--accent-main)" />
          </IconButton>
        )}
      </Box>
      <Divider color="var(--accent-200)" />
    </Card>
  );
};

export default CongregationInfo;
