import { IconArrowDown, IconCheck, IconEdit } from '@components/icons';
import CustomTypography from '@components/typography';
import { useEffect, useState } from 'react';
import {
  CustomDropdownContainerProps,
  CustomDropdownItemProps,
  CustomDropdownMenuProps,
} from './dropdown.types';
import { Box, Popper } from '@mui/material';
import CustomCheckbox from '@components/checkbox';

/**
 * Component for rendering a custom dropdown container.
 * Displays a label and an arrow icon to indicate dropdown functionality.
 *
 * @param {CustomDropdownContainerProps} props - Props for CustomDropdownContainer component.
 */
const CustomDropdownContainer = (props: CustomDropdownContainerProps) => {
  const arrowColor = props.arrowColor || 'var(--black)';
  const labelColor = props.labelColor || 'var(--black)';

  return (
    <Box
      ref={props.reference}
      sx={{
        display: 'flex',
        gap: '8px',
        cursor: 'pointer',
        justifyContent: 'center',
      }}
      onClick={(event) => {
        props.onClick(event);
      }}
    >
      <CustomTypography className="body-regular" color={labelColor}>
        {props.label}
      </CustomTypography>
      <IconArrowDown
        sx={{
          transform: props.open ? 'rotate(0.5turn)' : 'rotate(0)',
        }}
        color={arrowColor}
      />
    </Box>
  );
};

/**
 * Component for rendering a custom dropdown menu.
 * Displays a list of items within a popper.
 *
 * @param {CustomDropdownMenuProps} props - Props for CustomDropdownMenu component.
 */
const CustomDropdownMenu = (props: CustomDropdownMenuProps) => {
  return (
    <Popper
      open={props.open}
      sx={{ zIndex: props.zIndex }}
      anchorEl={props.anchorElement}
      placement={props.placement}
      ref={props.reference}
    >
      <Box
        className="small-card-shadow"
        sx={{
          maxWidth: '500px',
          borderRadius: 'var(--radius-l)',
          padding: '8px 0px 8px 0px',
          border: '1px solid var(--accent-200)',
          backgroundColor: 'var(--white)',
          width: props.width,
          maxHeight: '256px',
          overflowY: 'auto',
        }}
      >
        {props.children}
      </Box>
    </Popper>
  );
};

/**
 * Component for rendering a custom dropdown item.
 * Displays different types of items based on variant prop.
 *
 * @param {CustomDropdownItemProps} props - Props for CustomDropdownItem component.
 */
const CustomDropdownItem = (props: CustomDropdownItemProps) => {
  const variant = props.variant || 'standard';
  const propsChecked = props.checked || false;

  const [checked, setChecked] = useState(propsChecked);

  useEffect(() => {
    if ((checked && variant != 'studies') || variant != 'checkboxes') {
      props.callback(checked);
    }

    // fix bug with "infinity" value
    if (variant == 'schools' || variant == 'standard') {
      setChecked(false);
    }
  }, [checked, props, variant]);

  const itemContent = () => {
    switch (variant) {
      case 'checkboxes':
        return (
          <>
            <CustomCheckbox
              checked={props.checked}
              onChange={props.onCheckboxClick}
              sx={{
                '.MuiSvgIcon-root path': {
                  fill: 'var(--accent-350)',
                },
              }}
            />
            <CustomTypography className="body-regular" color={'var(--black)'}>
              {props.label}
            </CustomTypography>
          </>
        );
      case 'standard':
        return (
          <CustomTypography className="body-regular">
            {props.label}
          </CustomTypography>
        );
      case 'custom':
        return props.children;
      case 'studies':
        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <Box
                onClick={(event) => {
                  props.editButtonClick();
                  event.stopPropagation();
                }}
                sx={{ alignItems: 'center', display: 'flex' }}
              >
                <IconEdit
                  sx={{
                    path: {
                      fill: 'var(--accent-350) !important',
                    },
                  }}
                />
              </Box>
              <CustomTypography className="body-regular">
                {props.label}
              </CustomTypography>
            </Box>
            {checked ? (
              <IconCheck
                sx={{
                  path: {
                    fill: 'var(--accent-dark) !important',
                  },
                }}
              />
            ) : null}
          </Box>
        );
      case 'schools':
        return (
          <>
            {props.icon}
            <Box>
              <CustomTypography className="body-regular">
                {props.label}
              </CustomTypography>
              <CustomTypography
                className="body-small-regular"
                color="var(--grey-400)"
              >
                {props.description}
              </CustomTypography>
            </Box>
          </>
        );
    }
  };

  return (
    <Box
      ref={props.reference}
      sx={{
        padding: '8px 12px 8px 16px',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        borderBottom: '1px solid var(--accent-200)',
        cursor: 'pointer',

        '.MuiSvgIcon-root path': {
          fill: 'var(--black)',
        },

        '&:hover': {
          backgroundColor: 'var(--accent-100)',
          '.MuiTypography-root': {
            color: 'var(--accent-dark)',
          },

          '.MuiSvgIcon-root path': {
            fill: 'var(--accent-dark)',
          },
        },
        '.MuiFormControlLabel-root': {
          margin: '0',
          width: '24px',
        },
        ...props.sx,
      }}
      onClick={() => {
        if (
          variant == 'studies' ||
          variant == 'schools' ||
          variant == 'custom'
        ) {
          setChecked(!checked);

          // this code fix infinity loop with variant = 'studies'
          if (variant == 'studies') {
            props.callback(checked);
          }
        }

        if (variant == 'checkboxes') {
          props.onCheckboxClick(null, !props.checked);
        }
      }}
    >
      {itemContent()}
    </Box>
  );
};

export { CustomDropdownContainer, CustomDropdownMenu, CustomDropdownItem };
