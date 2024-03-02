import { Stack } from '@mui/material';
import { styled } from '@mui/system';

export const StyleDatePickerDay = {
  sx: {
    height: 'auto',
    width: '40px',
    margin: '0 4px',
    fontSize: '16px',
    lineHeight: '20px',
    color: 'var(--grey-400)',
    ':not(.Mui-selected)': {
      borderColor: 'var(--accent-main)',
    },
    ':hover': {
      backgroundColor: 'rgba(var(--accent-main-base), 0.1)',
    },
    ':focus': {
      backgroundColor: 'rgba(var(--accent-main-base), 0.1)',
    },
    '.MuiPickersYear-yearButton:hover': {
      backgroundColor: 'red',
    },
  },
};

export const StyleDatePickerDesktopPaper = {
  sx: {
    borderRadius: 'var(--radius-xxl)',
    border: '1px solid var(--accent-200)',
    backgroundColor: 'var(--white)',
  },
};

export const StyleDatePickerToolbar = {
  hidden: false,
  sx: {
    padding: '16px 12px 12px 24px',
    borderBottom: '1px solid var(--accent-200)',
    gap: '8px',
    '.MuiDatePickerToolbar-title': {
      color: 'var(--black)',
    },
  },
};

export const StyleDatePickerActionBar = {
  sx: {
    justifyContent: 'space-between',
  },
};

export const StyleDatePickerLayout = {
  sx: {
    '.MuiPickersCalendarHeader-label': {
      textTransform: 'capitalize',
      color: 'var(--grey-400)',
      fontFamily: 'Inter',
    },
    '.MuiPickersYear-yearButton:hover': {
      backgroundColor: 'rgba(var(--accent-main-base), 0.1)',
    },
  },
};

export const StyleDatePickerPopper = {
  width: '360px',
  '.MuiPickersLayout-root': {
    display: 'flex',
    flexDirection: 'column',
  },
  '.Mui-selected': {
    backgroundColor: 'var(--accent-main) !important',
  },
  '.MuiSvgIcon-root': {
    color: 'var(--grey-400)',
  },
  '.MuiDayCalendar-weekDayLabel': {
    width: '40px',
    fontSize: '16px',
    lineHeight: '20px',
    margin: '0 4px',
    color: 'var(--grey-400)',
  },
  '.MuiDialogActions-root': {
    justifyContent: 'space-between',
    padding: '12px',
    gap: '8px',
  },
  '.MuiDateCalendar-root': {
    margin: 'unset',
    width: 'inherit',
    padding: '0px 12px 0px 12px',
    overflowY: 'hidden',
    maxHeight: 'unset',
    height: 'auto',
  },
  '.MuiDayCalendar-weekContainer': {
    height: '48px',
    padding: '4px 0',
    margin: 'unset',
  },
  '.MuiDayCalendar-header': {
    height: '48px',
  },
  '.MuiPickersCalendarHeader-root': {
    padding: '4px 0 4px 12px',
    margin: 'unset',
    minHeight: '56px',
  },
  '.MuiPickersCalendarHeader-label': {
    fontSize: '14px',
    lineHeight: '18px',
  },
  '.MuiPickersYear-root': {
    height: '52px',
    color: 'var(--grey-400)',
  },
};

export const StyledIconWrapper = styled(Stack)({
  '& svg:hover': {
    background: 'var(--accent-350-base)',
    borderRadius: 'var(--radius-xl, 8px)',
    cursor: 'pointer',
  },
  '& svg g, & svg g path': {
    fill: 'var(--accent-350) !important',
  },
});
