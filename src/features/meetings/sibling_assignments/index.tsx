import { Stack } from '@mui/material';
import { IconCongregation, IconLanguageGroup } from '@components/icons';
import { SiblingAssignmentsProps } from './index.types';
import useSiblingAssignments from './useSiblingAssignments';
import Typography from '@components/typography';

const SiblingAssignments = (props: SiblingAssignmentsProps) => {
  const { assignments } = useSiblingAssignments(props);

  if (assignments.length === 0) return null;

  return (
    <Stack spacing="8px" padding="2px 0 2px 20px">
      {assignments.map((assignment) => (
        <Stack
          key={assignment.type}
          direction="row"
          spacing="10px"
          alignItems="center"
        >
          {assignment.type === 'main' && (
            <IconCongregation color="var(--grey-350)" width={16} height={16} />
          )}

          {assignment.type !== 'main' && (
            <IconLanguageGroup color="var(--grey-350)" width={16} height={16} />
          )}

          <Typography className="body-small-regular" color="var(--grey-350)">
            {assignment.value}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};

export default SiblingAssignments;
