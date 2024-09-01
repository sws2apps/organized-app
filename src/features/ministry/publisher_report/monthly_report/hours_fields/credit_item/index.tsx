import { Box, Stack } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import { CreditItemProps } from './index.types';
import useCreditItem from './useCreditItem';
import StandardEditor from '@features/ministry/standard_editor';
import Typography from '@components/typography';

const CreditItem = (props: CreditItemProps) => {
  const { tabletUp } = useBreakpoints();

  const {
    label,
    icon,
    desc,
    handleValueChange,
    value,
    validatorHours,
    status,
  } = useCreditItem(props);

  return (
    <Box
      sx={{
        padding: '8px 0px',
        display: 'flex',
        alignItems: tabletUp ? 'center' : 'unset',
        justifyContent: 'space-between',
        flexDirection:
          tabletUp ||
          props.credit.event === 'approved_assignment' ||
          status !== 'pending'
            ? 'row'
            : 'column',
        gap: '16px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {icon}
        <Stack>
          <Typography>{label}</Typography>
          {desc && (
            <Typography className="body-small-regular" color="var(--grey-400)">
              {desc}
            </Typography>
          )}
        </Stack>
      </Box>

      {props.credit.event === 'approved_assignment' && (
        <Typography className="h3">{value}</Typography>
      )}

      {props.credit.event !== 'approved_assignment' && (
        <StandardEditor
          className="h3"
          readOnly={status !== 'pending'}
          value={value}
          onChange={handleValueChange}
          validator={validatorHours}
        />
      )}
    </Box>
  );
};

export default CreditItem;
