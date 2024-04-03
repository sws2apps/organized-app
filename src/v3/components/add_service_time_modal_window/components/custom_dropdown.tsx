import { Box, Popper } from '@mui/material';
import { CustomDropdownContainerProps, CustomDropdownMenuProps } from './custom_dropdown.types';
import CustomTypography from '@components/typography';
import { IconAdd, IconArrowDown, IconCheck, IconEdit } from '@components/icons';
import { useEffect, useState } from 'react';

const CustomDropdownContainer = (props: CustomDropdownContainerProps) => {
  const [dropdownArrowRotation, setdropdownArrowRotation] = useState(false);

  return (
    <Box
      sx={{ display: 'flex', gap: '8px', cursor: 'pointer' }}
      onClick={(event) => {
        setdropdownArrowRotation((previous) => !previous);
        props.onClick(event);
      }}
    >
      <CustomTypography className="body-regular">{props.label}</CustomTypography>
      <IconArrowDown
        sx={{
          transform: dropdownArrowRotation ? 'rotate(0.5turn)' : 'rotate(0)',
        }}
        color="var(--black)"
      />
    </Box>
  );
};

const CustomDropdownMenu = (props: CustomDropdownMenuProps) => {
  const [itemsStates, setItemsStates] = useState(new Array<boolean>(props.items.length).fill(false));

  const toggleItemState = (index) => {
    setItemsStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  useEffect(() => {
    const tmpDropdownCheckedItems = [];

    props.items.forEach((item, index) => {
      if (itemsStates[index]) {
        tmpDropdownCheckedItems.push(item);
      }
    });

    props.checkedItems(tmpDropdownCheckedItems);
  }, [itemsStates, props]);

  const items = props.items.map((item, index) => {
    return (
      <Box
        key={index}
        sx={{
          display: 'flex',
          padding: '8px 12px 8px 16px',

          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          /* Divider */
          borderBottom: '1px solid var(--accent-200)',
        }}
        onClick={() => toggleItemState(index)}
      >
        <Box sx={{ gap: '8px', display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={(e) => {
              props.editIconClicked(index, item);
              e.stopPropagation();
            }}
          >
            <IconEdit color="var(--accent-350)" />
          </Box>
          <CustomTypography className="body-regular">{item}</CustomTypography>
        </Box>
        {itemsStates[index] ? <IconCheck color="var(--accent-dark)" /> : <Box sx={{ width: '24px', height: '24px' }} />}
      </Box>
    );
  });

  return (
    <Popper open={props.open} anchorEl={props.anchorElement} placement="bottom-start">
      <Box
        className="small-card-shadow"
        sx={{
          borderRadius: 'var(--radius-l)',
          border: '1px solid var(--accent-200)',
          padding: '8px 0px 8px 0px',
          backgroundColor: 'var(--white)',
          overflowY: 'scroll',
          maxHeight: '256px',
          width: props.width,
        }}
      >
        {items}
        <Box
          sx={{
            display: 'flex',
            padding: '8px 12px 8px 16px',
            gap: '8px',
            alignItems: 'center',
            cursor: 'pointer',
            /* Divider */
            borderBottom: '1px solid var(--accent-200)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <IconAdd color="var(--accent-dark)" />
          </Box>
          <CustomTypography className="h4" color="var(--accent-dark)">
            {props.labelAdd}
          </CustomTypography>
        </Box>
      </Box>
    </Popper>
  );
};

export { CustomDropdownContainer, CustomDropdownMenu };
