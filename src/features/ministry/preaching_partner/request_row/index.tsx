import { Box } from '@mui/material';
import { PreachingPartnerRowProps } from './index.types';
import useRequestRow from './useRequestRow';
import Badge from '@components/badge';
import Button from '@components/button';
import Typography from '@components/typography';

const PreachingPartnerRow = (props: PreachingPartnerRowProps) => {
  const { variant, actionLabel, actionIcon, onAction, request } = props;

  const { timeLabel, typeLabel, publisherName } = useRequestRow(props);

  const borderColor =
    variant === 'accent' ? 'var(--accent-main)' : 'var(--orange-dark)';

  const backgroundColor =
    variant === 'accent' ? 'var(--accent-150)' : 'var(--orange-secondary)';

  const textColor =
    variant === 'accent' ? 'var(--accent-dark)' : 'var(--orange-dark)';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
      }}
    >
      <Box
        sx={{
          minWidth: '120px',
          minHeight: '46px',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-s)',
          border: `1px solid ${borderColor}`,
          backgroundColor,
        }}
      >
        <Typography className="body-small-semibold" color={textColor}>
          {timeLabel}
        </Typography>
      </Box>

      <Box
        sx={{
          flex: '1 1 200px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          minWidth: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Typography className="h4">{publisherName}</Typography>
          <Badge size="medium" color={variant} text={typeLabel} />
        </Box>

        {request.request_data.comment.length > 0 && (
          <Typography
            className="label-small-regular"
            color="var(--grey-400)"
            sx={{ wordBreak: 'break-word' }}
          >
            {request.request_data.comment}
          </Typography>
        )}
      </Box>

      <Button variant="small" startIcon={actionIcon} onClick={onAction}>
        {actionLabel}
      </Button>
    </Box>
  );
};

export default PreachingPartnerRow;
