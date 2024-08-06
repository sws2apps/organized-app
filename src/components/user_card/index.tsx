import type { CustomUserCardProps } from './user_card.types';
import UserCardMaleImg from '@assets/img/illustration_male.svg?component';
import UserCardFemaleImg from '@assets/img/illustration_female.svg?component';
import IconDelete from '../icons/IconDelete';
import IconArrowLink from '../icons/IconArrowLink';
import MiniChip from '../mini_chip';
import Typography from '../typography';
import React from 'react';
import {
  StyledCard,
  StyledCardContent,
  StyledBox,
  StyledIconWrapper,
  StyledBoxSpaceBetween,
  StyledImgContainer,
  StyledCardBox,
} from './user_card.styles';

/**
 * A custom user card component.
 *
 * @param name The name of the user.
 * @param type The type of the user card.
 * @param female Specifies if the user is female.
 * @param onClick Callback function to handle click events on the user card.
 * @param onDelete Callback function to handle delete events on the user card.
 * @param chipLabels Optional chip labels to display on the user card.
 * @param children Additional content to render inside the user card.
 */
export const CustomUserCard = ({
  name,
  type,
  female,
  onClick,
  onDelete,
  chipLabels = [],
  children,
}: CustomUserCardProps) => {
  return (
    <StyledCardBox>
      <StyledCard onClick={() => onClick && onClick()}>
        <StyledCardContent>
          <StyledBox gap="13px" sx={{ flexWrap: 'nowrap' }}>
            <StyledBox gap="12px" sx={{ width: '100%' }}>
              <StyledImgContainer>
                {female ? <UserCardFemaleImg /> : <UserCardMaleImg />}
              </StyledImgContainer>
              <StyledBoxSpaceBetween flexDirection="column">
                <StyledBoxSpaceBetween flexDirection="row">
                  <StyledBoxSpaceBetween flexDirection="column">
                    <Typography className="h4">{name}</Typography>
                  </StyledBoxSpaceBetween>
                  {type == 'person' && (
                    <StyledBox
                      sx={{ flexGrow: '1', flexDirection: 'row-reverse' }}
                    >
                      <StyledBox gap="16px">
                        <StyledIconWrapper
                          hoverBackgrColor="var(--red-secondary)"
                          iconColor="var(--red-main)"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete && onDelete(e);
                          }}
                        >
                          <IconDelete />
                        </StyledIconWrapper>
                      </StyledBox>
                    </StyledBox>
                  )}
                </StyledBoxSpaceBetween>
                <StyledBox gap="8px" sx={{ flexWrap: 'wrap' }}>
                  {children}
                </StyledBox>
              </StyledBoxSpaceBetween>
              {type != 'person' && (
                <StyledBox
                  gap="8px"
                  sx={{
                    flexGrow: '1',
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                  }}
                >
                  <StyledIconWrapper
                    hoverBackgrColor="none"
                    iconColor="var(--black)"
                  >
                    <IconArrowLink />
                  </StyledIconWrapper>
                </StyledBox>
              )}
            </StyledBox>
          </StyledBox>

          {type == 'person' && chipLabels.length > 0 && (
            <StyledBox gap="13px">
              <StyledBox
                gap="8px"
                sx={{ alignItems: 'center', flexWrap: 'wrap' }}
              >
                {chipLabels.map((chipLabel, index) => (
                  <MiniChip key={index.toString()} label={chipLabel} />
                ))}
              </StyledBox>
            </StyledBox>
          )}
        </StyledCardContent>
      </StyledCard>
    </StyledCardBox>
  );
};

export default CustomUserCard;
