import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  MeetingAttendanceTotalBoxProps,
  MeetingAttendanceTotalBoxType,
} from './index.types';
import { StyledColorBox } from './index.styles';

function getBackgroundColor(type: MeetingAttendanceTotalBoxType) {
  switch (type) {
    case 'midweek':
      return 'var(--accent-150)';
    case 'weekend':
      return 'var(--green-secondary)';
    default:
      return 'var(--accent-150)';
  }
}

function getLabelColor(type: MeetingAttendanceTotalBoxType) {
  switch (type) {
    case 'midweek':
      return 'var(--accent-400)';
    case 'weekend':
      return 'var(--weekend-meeting)';
    default:
      return 'var(--accent-400)';
  }
}

function getValueColor(type: MeetingAttendanceTotalBoxType) {
  switch (type) {
    case 'midweek':
      return 'var(--accent-dark)';
    case 'weekend':
      return 'var(--weekend-meeting)';
    default:
      return 'var(--accent-dark)';
  }
}

export const MeetingAttendanceTotalBox = (
  props: MeetingAttendanceTotalBoxProps
) => {
  return (
    <StyledColorBox backgroudColor={getBackgroundColor(props.type)}>
      <Typography
        className="H4"
        color={getValueColor(props.type)}
        sx={{ textAlign: 'center' }}
      >
        {props.value}
      </Typography>
      <Typography
        className="label-small-regular"
        color={getLabelColor(props.type)}
        sx={{ textAlign: 'center' }}
      >
        {props.label}
      </Typography>
    </StyledColorBox>
  );
};
