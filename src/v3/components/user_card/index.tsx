import { Box } from '@mui/material';
import type { CustomUserCardProps } from './user_card.types';
import UserCardImg from '@assets/img/illustration_userCard.svg?component';
import UserCardFemaleImg from '@assets/img/illustration_userCard1.svg?component';
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
              <StyledImgContainer>{female ? <UserCardFemaleImg /> : <UserCardImg />}</StyledImgContainer>
              <StyledBoxSpaceBetween flexDirection="column">
                <StyledBoxSpaceBetween flexDirection="row">
                  <StyledBoxSpaceBetween flexDirection="column">
                    <Typography variant="h4">{name}</Typography>
                  </StyledBoxSpaceBetween>
                  {type == 'personal' && (
                    <StyledBox sx={{ flexGrow: '1', flexDirection: 'row-reverse' }}>
                      <StyledBox gap="16px">
                        <StyledIconWrapper hoverBackgrColor="var(--red-secondary)" iconColor="var(--red-main)">
                          <Box onClick={() => onDelete && onDelete()}>
                            <IconDelete />
                          </Box>
                        </StyledIconWrapper>
                      </StyledBox>
                    </StyledBox>
                  )}
                </StyledBoxSpaceBetween>
                <StyledBox gap="8px" sx={{ flexWrap: 'wrap' }}>
                  {children}
                </StyledBox>
              </StyledBoxSpaceBetween>
              {type != 'personal' && (
                <StyledBox gap="8px" sx={{ flexGrow: '1', flexDirection: 'row-reverse', alignItems: 'center' }}>
                  <StyledIconWrapper hoverBackgrColor="none" iconColor="var(--black)">
                    <IconArrowLink />
                  </StyledIconWrapper>
                </StyledBox>
              )}
            </StyledBox>
          </StyledBox>

          {type == 'personal' && chipLabels.length > 0 && (
            <StyledBox gap="13px">
              <StyledBox gap="8px" sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
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
