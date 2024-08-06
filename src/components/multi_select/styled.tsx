import React from 'react';
import { styled } from '@mui/system';
import {
  BaseSelectProps,
  FormControl,
  MenuItem,
  OutlinedSelectProps,
  Select,
} from '@mui/material';

type StyledMultiSelectBaseProps = {
  height: number;
  varHeight: number;
  children?: React.ReactNode;
} & BaseSelectProps &
  OutlinedSelectProps;

export const StyledMultiSelectBase = styled(Select)<StyledMultiSelectBaseProps>`
  & .MuiSelect-icon {
    color: var(--black) !important; // change the color of the dropdown icon
  }
  height: ${({ height }) => `${height}px`};
  display: flex;
  align-items: center;
  gap: 8px;
  .MuiOutlinedInput-notchedOutline {
    border: 1px solid var(--accent-350);
    border-radius: var(--radius-l);
  }
  .MuiInputBase-input {
    padding-top: ${({ varHeight }) => `calc(14.5px - ${varHeight}px)`};
    padding-bottom: ${({ varHeight }) => `calc(14.5px - ${varHeight}px)`};
    color: var(--black);

    &.MuiSelect-select {
      minheight: 'unset';
      overflow: 'hidden';
      textoverflow: 'ellipsis';
      whitespace: 'nowrap';
      display: 'block';
    }
    & .MuiListItemText-root {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: none;
    }
    & .MuiCheckbox-root {
      display: none;
    }
  }
`;

export const StyledMultiSelect = styled(
  ({ className, ...props }: StyledMultiSelectBaseProps) => (
    <StyledMultiSelectBase
      {...props}
      MenuProps={{ PaperProps: { className } }}
    />
  )
)(({ theme }) => ({
  background: 'var(--white)',
  backgroundColor: 'var(--white)',
  borderRadius: 'var(--radius-l)',
  border: '1px solid var(--accent-200)',
  padding: '8px 0px',
  marginTop: '2px',
  maxHeight: '256px',
  color: 'var(--black)',
  '& ul': { paddingTop: 0, paddingBottom: 0, gap: '5px' },
  '& li': {
    position: 'relative',
    height: '48px',
    '&:hover': {
      backgroundColor: 'var(--accent-100)',
    },
    borderBottom: '1px solid var(--accent-200)',
  },
  '& li:last-child': {
    borderBottom: 'none',
  },
  [theme.breakpoints.down('tablet')]: {
    marginLeft: '-4px',
  },
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '& svg': {
    color: 'var(--accent-350)',
    boxSizing: 'content-box',
  },
  '&.Mui-focused svg': {
    color: 'var(--black)',
  },
  '& fieldset': {
    border: '1px solid var(--accent-350)',
  },
  '&:hover fieldset': {
    border: '1px solid var(--accent-main)',
  },
  '&.Mui-focused fieldset': {
    border: '1px solid var(--accent-main)',
  },
}));

type StyledFormControlProps = {
  varHeight: number;
};

export const StyledFormControl = styled(FormControl)<StyledFormControlProps>`
  .MuiFormLabel-root[data-shrink='false'] {
    top: ${({ varHeight }) => `-${varHeight}px`};
  }
  .MuiInputLabel-root {
    color: var(--accent-350);
    &.Mui-focused {
      color: var(--accent-main);
    }
  }
  .MuiOutlinedInput-root {
    & svg {
      color: var(--accent-350);
      boxsizing: content-box;
    }
    &.Mui-focused svg {
      color: var(--black);
    }
    & fieldset {
      border: 1px solid var(--accent-350);
    }
    &:hover fieldset {
      border: 1px solid var(--accent-main);
    }
    &.Mui-focused fieldset {
      border: 1px solid var(--accent-main);
    }
  }
`;

export const StyledMenuItem = styled(MenuItem)`
  &.Mui-selected {
    background-color: inherit;
  }
  & svg {
    fill: var(--accent-main);
  }
`;
