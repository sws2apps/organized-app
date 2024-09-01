import { Stack } from '@mui/material';
import useHoursFields from './useHoursFields';
import CreditItem from './credit_item';
import Divider from '@components/divider';
import HourItem from './hour_item';

const HoursFields = () => {
  const { hours_credit } = useHoursFields();

  return (
    <Stack
      spacing="16px"
      borderTop="1px solid var(--accent-200)"
      borderBottom="1px solid var(--accent-200)"
      marginTop="-8px !important"
      padding="16px 0"
      divider={<Divider color="var(--accent-200)" dashed />}
    >
      <HourItem />

      {hours_credit > 0 && <CreditItem />}
    </Stack>
  );
};

export default HoursFields;
