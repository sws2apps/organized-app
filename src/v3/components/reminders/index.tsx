import React, { useState, useEffect } from 'react';
import { Typography } from '@components';
import IconReminder from '../icons/IconReminder';
import { Button } from '@components';
import { RemindersProps, ReminderItemProps } from './reminders.types';
import { RemindersCard, RemindersTitle, RemindersList, RemindersFooter } from './reminders.styled';

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
    <RemindersCard>
      <RemindersTitle>
        <IconReminder color="var(--always-white)" />
        <Typography className="h4" color="var(--always-white)">
          Reminders
        </Typography>
      </RemindersTitle>

      <RemindersList>{children}</RemindersList>

      <RemindersFooter>
        <Button variant="main" color="orange" onClick={onRemind}>
          remind me tomorrow
        </Button>
        <Button variant="semi-white" onClick={onGoTo}>
          Go to reports
        </Button>
      </RemindersFooter>
    </RemindersCard>
  );
};

export default Reminders;
