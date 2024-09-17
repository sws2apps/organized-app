import { Stack } from '@mui/material';
import { CommitteeMemberProps } from './index.types';
import Typography from '@components/typography';

const CommitteeMember = ({ name, role }: CommitteeMemberProps) => {
  return (
    <Stack
      spacing="4px"
      borderRadius="var(--radius-l)"
      padding="8px 8px 8px 16px"
      border="1px solid var(--accent-300)"
    >
      <Typography className="h4">{name}</Typography>
      <Typography className="body-small-regular" color="var(--grey-01)">
        {role}
      </Typography>
    </Stack>
  );
};

export default CommitteeMember;
