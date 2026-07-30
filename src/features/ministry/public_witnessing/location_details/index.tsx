import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconCart, IconNormalPin, IconVisitors } from '@components/icons';
import Badge from '@components/badge';
import Card from '@components/card';
import Typography from '@components/typography';
import { LocationDetailsProps } from './index.types';

const LocationDetails = ({ location }: LocationDetailsProps) => {
  const { t } = useAppTranslation();
  const { laptopUp } = useBreakpoints();

  const { name, address, cart_stored_at, max_publishers, description } =
    location.location_data;

  // "badge-medium-light" from the design: 12px label, 6px radius, the
  // lightest accent fill and 4/8 padding.
  const badgeProps = {
    size: 'small' as const,
    color: 'accent' as const,
    className: 'label-small-medium' as const,
    sx: {
      height: '24px',
      gap: '4px',
      padding: '4px 8px',
      borderRadius: 'var(--radius-m)',
      background: 'var(--accent-100)',
    },
  };

  return (
    <Card sx={{ padding: laptopUp ? '24px' : '16px', gap: '24px' }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <Typography className="h2">{name}</Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {cart_stored_at.length > 0 && (
            <Badge
              {...badgeProps}
              icon={
                <IconCart color="var(--accent-dark)" width={16} height={16} />
              }
              text={t('tr_PWStoredAt', { name: cart_stored_at })}
            />
          )}
          {max_publishers && (
            <Badge
              {...badgeProps}
              icon={<IconVisitors width={16} height={16} />}
              text={t('tr_maxPublisherShift', {
                maxPublisherCount: max_publishers,
              })}
            />
          )}
          {address.length > 0 && (
            <Badge
              {...badgeProps}
              icon={<IconNormalPin width={16} height={16} />}
              text={address}
            />
          )}
        </Box>
      </Box>

      {description.length > 0 && (
        <Typography className="body-small-regular" color="var(--grey-400)">
          {description}
        </Typography>
      )}
    </Card>
  );
};

export default LocationDetails;
