import { useNavigate } from 'react-router-dom';
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
            color="var(--always-white)"
            sx={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={path ? () => navigate(path) : undefined}
          >
            {title}
          </Typography>
          <Typography
            className="body-small-regular"
            color="var(--always-white)"
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
