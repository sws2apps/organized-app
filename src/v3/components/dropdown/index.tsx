import {
  IconAdd,
  IconArrowDown,
  IconCheck,
  IconEdit,
  IconLanguageCourse,
  IconPersonalDay,
  IconSchool,
  IconSchoolForEvangelizers,
} from '@components/icons';
import CustomTypography from '@components/typography';
import { useEffect, useState } from 'react';
import { CustomDropdownContainerProps, CustomDropdownMenuProps } from './dropdown.types';
import { Box, Popper } from '@mui/material';
import useAppTranslation from '@hooks/useAppTranslation';
import { StyledItemBoxForDropdownWithSchools } from './dropdown.styled';

/**
 * Component for rendering a custom dropdown container.
 * @param props - Props for CustomDropdownContainer.
 */
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

/**
 * Component for rendering a custom dropdown menu.
 * @param props - Props for CustomDropdownMenu.
 */
const CustomDropdownMenu = (props: CustomDropdownMenuProps) => {
  const variant = props.variant || 'schools';

  const hours = {
    pioneerSchool: 30,
    SKE: 80,
    languageCourse: 25,
    personalDay: 5,
  };

  const { t } = useAppTranslation();

  const [itemsStates, setItemsStates] = useState(() => {
    if (variant == 'studies') {
      return new Array<boolean>(props.items?.length).fill(false);
    }
  });

  const toggleItemState = (index) => {
    setItemsStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  useEffect(() => {
    const tmpDropdownCheckedItems = [];

    if (variant == 'studies') {
      props.items.forEach((item, index) => {
        if (itemsStates[index]) {
          tmpDropdownCheckedItems.push(item);
        }
      });
    }

    props.callback(tmpDropdownCheckedItems);
  }, [itemsStates, props, variant]);

  if (variant == 'studies') {
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
                props.editItemButtonClick(index, item);
                e.stopPropagation();
              }}
            >
              <IconEdit color="var(--accent-350)" />
            </Box>
            <CustomTypography className="body-regular">{item}</CustomTypography>
          </Box>
          {itemsStates[index] ? (
            <IconCheck color="var(--accent-dark)" />
          ) : (
            <Box sx={{ width: '24px', height: '24px' }} />
          )}
        </Box>
      );
    });

    return (
      <Popper open={props.open} anchorEl={props.anchorElement} sx={{ zIndex: props.zIndex }} placement="bottom-start">
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
              {t('tr_addNewStudy')}
            </CustomTypography>
          </Box>
        </Box>
      </Popper>
    );
  }
  if (variant == 'schools') {
    return (
      <Popper open={props.open} anchorEl={props.anchorElement} sx={{ zIndex: props.zIndex }} placement="bottom-start">
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
          <StyledItemBoxForDropdownWithSchools onClick={() => props.callback(hours.pioneerSchool)}>
            <IconSchool />
            <Box sx={{ alignItems: 'center' }}>
              <CustomTypography className="body-regular">{t('tr_pioneerSchool')}</CustomTypography>
              <CustomTypography className="body-small-regular" color="var(--grey-400)">
                {t('tr_ministryTimeHours', { ministryTime: hours.pioneerSchool })}
              </CustomTypography>
            </Box>
          </StyledItemBoxForDropdownWithSchools>
          <StyledItemBoxForDropdownWithSchools onClick={() => props.callback(hours.SKE)}>
            <IconSchoolForEvangelizers />
            <Box sx={{ alignItems: 'center' }}>
              <CustomTypography className="body-regular">{t('tr_SKE')}</CustomTypography>
              <CustomTypography className="body-small-regular" color="var(--grey-400)">
                {t('tr_ministryTimeHours', { ministryTime: hours.SKE })}
              </CustomTypography>
            </Box>
          </StyledItemBoxForDropdownWithSchools>
          <StyledItemBoxForDropdownWithSchools onClick={() => props.callback(hours.languageCourse)}>
            <IconLanguageCourse />
            <Box sx={{ alignItems: 'center' }}>
              <CustomTypography className="body-regular">{t('tr_languageCourse')}</CustomTypography>
              <CustomTypography className="body-small-regular" color="var(--grey-400)">
                {t('tr_ministryTimeHours', { ministryTime: hours.languageCourse })}
              </CustomTypography>
            </Box>
          </StyledItemBoxForDropdownWithSchools>
          <StyledItemBoxForDropdownWithSchools onClick={() => props.callback(hours.personalDay)}>
            <IconPersonalDay />
            <Box sx={{ alignItems: 'center' }}>
              <CustomTypography className="body-regular">{t('tr_personalDay')}</CustomTypography>
              <CustomTypography className="body-small-regular" color="var(--grey-400)">
                {t('tr_ministryTimeHours', { ministryTime: hours.personalDay })}
              </CustomTypography>
            </Box>
          </StyledItemBoxForDropdownWithSchools>
        </Box>
      </Popper>
    );
  }
};

export { CustomDropdownContainer, CustomDropdownMenu };
