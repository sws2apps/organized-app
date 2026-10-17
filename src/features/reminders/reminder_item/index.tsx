import { useNavigate } from 'react-router';
import { Stack } from '@mui/material';
import { StyledReminderBox, StyledReminderLi } from './index.styles';
import { ReminderItemProps } from '../index.types';
import Typography from '@components/typography';
import { IconArrowLink } from '@components/icons';

const ReminderItem = ({ title, description, path }: ReminderItemProps) => {
  const navigate = useNavigate();

  return (
    <StyledReminderLi>
      <StyledReminderBox>
        <Stack spacing="4px">
          <Typography
            className="h4"
            onClick={path ? () => navigate(path) : undefined}
            sx={{
              color: 'var(--always-white)',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            {title}
          </Typography>
          <Typography
            className="body-small-regular"
            sx={{
              color: 'var(--always-white)',
            }}
          >
            {description}
          </Typography>
        </Stack>
        <IconArrowLink color="var(--always-white)" />
      </StyledReminderBox>
    </StyledReminderLi>
  );
};

export default ReminderItem;
