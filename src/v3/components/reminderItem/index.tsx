import { Typography } from '@components';
import { ReminderObject } from './reminderItem.types';
import { Box } from '@mui/material';
import { ReminderLi, ReminderBox, StyledPoint } from './reminderItem.styles';

const ReminderItem = (props: ReminderObject) => {
  const { title, description, link } = props;

  return (
    <>
      <ReminderLi>
        <ReminderBox>
          <StyledPoint>•</StyledPoint>
          <Box>
            <Typography className="h4" color="var(--always-white)">
              {title}
            </Typography>
            <Typography className="body-small-regular" color="var(--always-white)">
              {description}
            </Typography>
          </Box>
        </ReminderBox>
      </ReminderLi>
    </>
  );
};

export default ReminderItem;
