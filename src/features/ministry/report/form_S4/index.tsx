import { Stack } from '@mui/material';
import { FormS4Props } from './index.types';
import useFormS4 from './useFormS4';
import BibleStudies from './bible_studies';
import Comments from './comments';
import Divider from '@components/divider';
import HoursCredits from './hours_credits';
import HoursFields from './hours_fields';
import MinistryShared from './ministry_shared';
import SubmitButton from './submit_button';

const FormS4 = ({ month, person_uid, publisher }: FormS4Props) => {
  const { hours_credit_enabled, isHourEnabled } = useFormS4({
    month,
    person_uid,
    publisher,
  });

  return (
    <Stack spacing="16px">
      <MinistryShared
        month={month}
        person_uid={person_uid}
        publisher={publisher}
      />

      <Divider color="var(--accent-200)" />

      <Stack spacing="16px" divider={<Divider color="var(--accent-200)" />}>
        {isHourEnabled && (
          <Stack
            spacing="16px"
            divider={<Divider color="var(--accent-200)" dashed />}
          >
            <HoursFields
              month={month}
              person_uid={person_uid}
              publisher={publisher}
            />

            {hours_credit_enabled && (
              <HoursCredits
                month={month}
                person_uid={person_uid}
                publisher={publisher}
              />
            )}
          </Stack>
        )}

        <BibleStudies
          month={month}
          person_uid={person_uid}
          publisher={publisher}
        />
      </Stack>

      <Divider color="var(--accent-200)" />

      <Comments month={month} person_uid={person_uid} publisher={publisher} />

      {publisher && (
        <SubmitButton
          month={month}
          person_uid={person_uid}
          publisher={publisher}
        />
      )}
    </Stack>
  );
};

export default FormS4;
