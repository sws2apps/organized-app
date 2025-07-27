import { Stack, styled, Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import {
  ExportedPickersLayoutSlotProps,
  PickersLayoutProps,
} from '@mui/x-date-pickers';
import { ExportedDatePickerToolbarProps } from '@mui/x-date-pickers/DatePicker/DatePickerToolbar';
import {
  DayCalendarSlotProps,
  PickerPopperSlotProps,
} from '@mui/x-date-pickers/internals';

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
    '&.MuiPickersDay-dayOutsideMonth': {
      color: 'var(--grey-200)',
    },
    '.MuiPickersYear-yearButton:hover': {
      backgroundColor: 'red',
    },
    '@media (max-width:430px)': {
      height: '100%',
    },
  },
} as DayCalendarSlotProps['day'];

export const StyleDatePickerDesktopPaper = {
  sx: {
    borderRadius: 'var(--radius-xxl)',
    border: '1px solid var(--accent-200)',
    backgroundColor: 'var(--white)',
  },
} as PickerPopperSlotProps['desktopPaper'];

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
} as ExportedDatePickerToolbarProps;

export const StyleDatePickerActionBar = {
  sx: {
    justifyContent: 'space-between',
  },
} as ExportedPickersLayoutSlotProps<Date>['actionBar'];

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
} as Partial<PickersLayoutProps<Date>>;

export const StyleDatePickerPopper: SxProps<Theme> = {
  width: '360px',
  '@media (max-width:430px)': {
    width: '90vw',
  },
  '.MuiPickersLayout-root': {
    display: 'flex',
    flexDirection: 'column',
  },
  '.Mui-selected': {
    backgroundColor: 'var(--accent-main) !important',
  },
  '.Mui-disabled': {
    color: 'var(--grey-200) !important',
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
    maxHeight: '400px',
    height: '100%',
    '@media (max-width:376px)': {
      padding: '0 5px',
    },
  },
  '.MuiDayCalendar-weekContainer': {
    height: '48px',
    padding: '4px 0',
    margin: 'unset',
    '@media (max-width:374px)': {
      height: '41px',
    },
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
  ':hover': {
    cursor: 'pointer',
  },
  '& svg:hover': {
    background: 'var(--accent-350-base)',
    '& g, & g path': {
      fill: 'var(--accent-400) !important',
    },
  },
  '& svg g, & svg g path': {
    fill: 'var(--accent-350) !important',
  },
}) as unknown as typeof Stack;
