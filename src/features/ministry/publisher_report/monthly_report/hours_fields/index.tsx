import { Stack } from '@mui/material';
import useHoursFields from './useHoursFields';
import CreditItem from './credit_item';
import Divider from '@components/divider';
import HourItem from './hour_item';

const HoursFields = () => {
  const { hoursCredits } = useHoursFields();

  return (
    <Stack
      spacing="16px"
      borderTop="1px solid var(--accent-200)"
      borderBottom="1px solid var(--accent-200)"
      padding="16px 0"
      divider={<Divider color="var(--accent-200)" dashed />}
    >
      <HourItem />

      {hoursCredits.length > 0 && (
        <Stack
          spacing="4px"
          divider={<Divider color="var(--accent-200)" dashed />}
        >
          {hoursCredits.map((credit) => (
            <CreditItem key={credit.event} credit={credit} />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default HoursFields;
