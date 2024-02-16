export const StyleTimePickerPopper = {
  '.MuiClockPointer-root': {
    backgroundColor: 'var(--accent-main)',
  },
  '.MuiClock-pin': {
    backgroundColor: 'var(--accent-main)',
  },
  '.MuiClockPointer-thumb': {
    backgroundColor: 'var(--accent-main)',
    borderColor: 'var(--accent-main)',
  },
  '.MuiClockNumber-root': {
    color: 'var(--black)',
    '&.Mui-selected': {
      color: 'var(--always-white)',
    },
  },
  '.MuiClock-clock': {
    backgroundColor: 'var(--accent-200)',
    height: '225px',
    width: '225px',
    padding: '2px 0 0 2px',
    transform: 'scale(1.1)',
  },
  button: {
    '&[title="PM"]': {
      display: 'none',
    },
    '&[title="open previous view"]': {
      display: 'none',
    },
    '&[title="open next view"]': {
      display: 'none',
    },
    '&[title="AM"]': {
      display: 'none',
    },
  },
};

export const StyleTimePickerPaper = {
  sx: {
    backgroundColor: 'var(--white)',
    borderRadius: 'var(--radius-xxl)',
  },
};
export const StyleTimePickerToolbar = {
  '& > *:first-of-type': {
    color: 'var(--black)',
    fontSize: '16px',
    textDecoration: 'none',
    fontFamily: 'Inter',
    fontWeight: 570,
    fontStyle: 'normal',
    fontStretch: 'normal',
    letterSpacing: '0px',
    lineHeight: '20px',
    textIndent: '0px',
    textTransform: 'none',
    marginBottom: '20px',
  },
  '.MuiTimePickerToolbar-ampmLandscape': {
    '& > *:first-of-type': {
      borderTopRightRadius: '0',
      borderBottomRightRadius: '0',
    },
    '& > *:last-of-type': {
      borderLeft: '0',
      borderTopLeftRadius: '0',
      borderBottomLeftRadius: '0',
    },
    button: {
      border: '1px solid var(--accent-300)',
      span: { color: 'var(--accent-400)' },
    },
  },
  '.MuiTimePickerToolbar-separator': {
    height: '105%',
    margin: '0 4px 0 4px',
  },
  button: {
    width: '100%',
    height: '100%',
    borderRadius: 'var(--radius-l)',
    backgroundColor: 'var(--accent-150)',
    ':hover': {
      backgroundColor: 'var(--accent-300)',
    },
    '.Mui-selected': {
      borderRadius: 'inherit',
      backgroundColor: 'var(--accent-200)',
      color: 'var(--accent-dark) !important',
      width: '100%',
      height: '100%',
    },
  },
};
