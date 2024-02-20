import React, { useState, useEffect } from 'react';
import { Typography } from '@components';
import { Box } from '@mui/material';
import IconReminder from '../icons/IconReminder';
import { Button } from '@components';
import { RemindersProps, ReminderItemProps } from './reminders.types';
import {
  StyledRemindersCard,
  StyledRemindersTitle,
  StyledRemindersList,
  StyledRemindersFooter,
  StyledReminderLi,
  StyledReminderBox,
  StyledPoint,
} from './reminders.styled';

const Reminders = ({ children }: RemindersProps) => {
  const [reminderDate, setReminderDate] = useState<string | null>(null);

  useEffect(() => {
    const storedReminderDate = localStorage.getItem('reminderDate');

    if (storedReminderDate) {
      setReminderDate(storedReminderDate);
    }
  }, []);

  const LinkTo = () => {
    if (React.Children.count(children) > 0 && React.isValidElement(children[0])) {
      const firstChild = children[0] as React.ReactElement<ReminderItemProps>;
      const firstChildLink = firstChild.props.link;
      return firstChildLink;
    }
  };

  const onGoTo = () => {
    const link = LinkTo();

    if (link) {
      window.location.href = link;
    }
  };

  const onRemind = () => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);

    const newReminderDate = currentDate.toISOString();

    localStorage.setItem('reminderDate', newReminderDate);
    setReminderDate(newReminderDate);
  };

  return (
    <StyledRemindersCard className="warning-glow">
      <StyledRemindersTitle>
        <IconReminder color="var(--always-white)" />
        <Typography className="h4" color="var(--always-white)">
          Reminders
        </Typography>
      </StyledRemindersTitle>

      <StyledRemindersList>{children}</StyledRemindersList>

      <StyledRemindersFooter>
        {reminderDate && (
          <Button variant="main" color="orange" onClick={onRemind}>
            remind me tomorrow
          </Button>
        )}
        <Button variant="semi-white" onClick={onGoTo}>
          Go to reports
        </Button>
      </StyledRemindersFooter>
    </StyledRemindersCard>
  );
};

const ReminderItem = (props: ReminderItemProps) => {
  const { title, description } = props;

  return (
    <>
      <StyledReminderLi>
        <StyledReminderBox>
          <StyledPoint>•</StyledPoint>
          <Box>
            <Typography className="h4" color="var(--always-white)">
              {title}
            </Typography>
            <Typography className="body-small-regular" color="var(--always-white)">
              {description}
            </Typography>
          </Box>
        </StyledReminderBox>
      </StyledReminderLi>
    </>
  );
};

export { ReminderItem, Reminders };
