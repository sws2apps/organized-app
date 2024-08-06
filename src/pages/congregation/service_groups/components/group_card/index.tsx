import { Box, Popper } from '@mui/material';
import {
  GroupCardContainerProps,
  GroupCardContentItemProps,
  GroupCardDividerProps,
  GroupCardHeaderProps,
  GroupCardMenuProps,
} from './group_card.types';
import CustomTypography from '@components/typography';
import useAppTranslation from '@hooks/useAppTranslation';
import {
  IconAssistant,
  IconEdit,
  IconGroupOverseer,
  IconMore,
  IconMyGroup,
  IconRemovePerson,
  IconVisitors,
} from '@components/icons';
import CustomIconButton from '@components/icon_button';
import CustomDivider from '@components/divider';
import { useEffect, useRef, useState } from 'react';

export const GroupCardContainer = (props: GroupCardContainerProps) => {
  return (
    <Box
      sx={{
        padding: '8px',
        gap: '4px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-xl)',
        border: `1px solid rgb(from ${props.color} r g b / 48%)`,
      }}
    >
      {props.children}
    </Box>
  );
};

export const GroupCardHeader = (props: GroupCardHeaderProps) => {
  const { t } = useAppTranslation();

  return (
    <Box
      sx={{
        padding: '8px 16px 8px 16px',
        borderRadius: '6px',
        backgroundColor: `rgb(from var(--group-${props.groupNumber}) r g b / 12%)`,
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'flex',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
          }}
        >
          <CustomTypography
            className="h3"
            color={`var(--group-${props.groupNumber})`}
          >
            {t('tr_groupNumber', { groupNumber: props.groupNumber })}
          </CustomTypography>
          <Box
            sx={{
              display: 'flex',
              gap: '4px',
              padding: '2px 8px 2px 8px',
              borderRadius: 'var(--radius-s)',
              alignItems: 'center',
              backgroundColor: `var(--group-${props.groupNumber})`,
            }}
          >
            <IconVisitors color="var(--always-white)" width={16} height={16} />
            <CustomTypography
              className="body-small-semibold"
              color={'var(--always-white)'}
            >
              {props.visitorsCount.toString()}
            </CustomTypography>
          </Box>
        </Box>
        {props.groupName && (
          <CustomTypography
            className="body-regular"
            color={`var(--group-${props.groupNumber})`}
          >
            {props.groupName}
          </CustomTypography>
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {props.isMyGroup && (
          <IconMyGroup color={`var(--group-${props.groupNumber})`} />
        )}

        <Box
          onClick={props.onEditButtonClick}
          sx={{
            cursor: 'pointer',
            height: '24px',
            width: '24px',
          }}
        >
          <IconEdit color={`var(--group-${props.groupNumber})`} />
        </Box>
      </Box>
    </Box>
  );
};

export const GroupCardContentItem = (props: GroupCardContentItemProps) => {
  const [anchorElement, setAnchorElement] = useState(null);
  const [displayMenu, setDisplayMenu] = useState(false);

  const groupCardMenuReference = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        displayMenu &&
        groupCardMenuReference.current &&
        !groupCardMenuReference.current.contains(event.target)
      ) {
        setDisplayMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [displayMenu]);

  return (
    <Box
      sx={{
        padding: '4px 8px 4px 8px',
        borderRadius: 'var(--radius-s)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',

        gap: '8px',

        '&:hover': {
          backgroundColor: `rgb(from var(--group-${props.groupNumber}) r g b / 6%)`,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        {props.icon}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <CustomTypography className="body-regular" color={'var(--black)'}>
            {props.primaryText}
          </CustomTypography>

          {props.descriptionText && (
            <CustomTypography
              className="label-small-medium"
              color={'var(--grey-400)'}
            >
              {props.descriptionText}
            </CustomTypography>
          )}
          {props.thirdText && (
            <CustomTypography
              className="label-small-regular"
              color={'var(--grey-350)'}
            >
              {props.thirdText}
            </CustomTypography>
          )}
        </Box>
      </Box>
      <CustomIconButton
        sx={{
          height: '24px',
          width: '24px',
          '&:hover': {
            backgroundColor: `rgb(from var(--group-${props.groupNumber}) r g b / 12%)`,
          },
        }}
        onClick={(e) => {
          setAnchorElement(e.currentTarget);
          setDisplayMenu(true);
        }}
      >
        <IconMore color="var(--grey-400)" />
      </CustomIconButton>
      <GroupCardMenu
        anchorElement={anchorElement}
        open={displayMenu}
        isBaptized={props.isBaptized}
        reference={groupCardMenuReference}
        onMakeAssistantClick={props.onMakeAssistantClick}
        onMakeGroupOverseerClick={props.onMakeGroupOverseerClick}
        onRemoveFromTheGroupClick={props.onRemoveFromTheGroupClick}
      />
    </Box>
  );
};

export const GroupCardMenu = (props: GroupCardMenuProps) => {
  const { t } = useAppTranslation();

  return (
    <Popper
      open={props.open}
      anchorEl={props.anchorElement}
      ref={props.reference}
    >
      <Box
        sx={{
          width: '256px',
          padding: '8px 0px 8px 0px',
          borderRadius: 'var(--radius-l)',
          backgroundColor: 'var(--white)',
          border: '1px solid var(--accent-200)',
          cursor: 'pointer',
        }}
        className="small-card-shadow"
      >
        {props.isBaptized && (
          <>
            <Box
              sx={{
                padding: '8px 12px 8px 16px',
                display: 'flex',
                gap: '8px',

                '&:hover': {
                  backgroundColor: 'var(--accent-150)',
                },
              }}
            >
              <IconAssistant color="var(--black)" />
              <CustomTypography className="body-regular" color={'var(--black)'}>
                {t('tr_makeOverseer')}
              </CustomTypography>
            </Box>
            <CustomDivider color="var(--accent-200)" />
            <Box
              sx={{
                padding: '8px 12px 8px 16px',
                display: 'flex',
                gap: '8px',

                '&:hover': {
                  backgroundColor: 'var(--accent-150)',
                },
              }}
            >
              <IconGroupOverseer color="var(--black)" />
              <CustomTypography className="body-regular" color={'var(--black)'}>
                {t('tr_makeAssistant')}
              </CustomTypography>
            </Box>
            <CustomDivider color="var(--accent-200)" />
          </>
        )}

        <Box
          sx={{
            padding: '8px 12px 8px 16px',
            display: 'flex',
            gap: '8px',

            '&:hover': {
              backgroundColor: 'var(--accent-150)',
            },
          }}
        >
          <IconRemovePerson color="var(--red-main)" />
          <CustomTypography className="body-regular" color={'var(--red-main)'}>
            {t('tr_removeFromGroups')}
          </CustomTypography>
        </Box>
      </Box>
    </Popper>
  );
};

export const GroupCardDivider = (props: GroupCardDividerProps) => {
  return (
    <CustomDivider
      color={`rgb(from var(--group-${props.groupNumber}) r g b / 16%)`}
    />
  );
};
