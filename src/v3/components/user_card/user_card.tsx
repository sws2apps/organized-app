import { Typography, Box } from '@mui/material';
import type { CPEUserCardProps } from './user_card.types';
import UserCardImg from '@assets/img/illustration_userCard.svg?component';
import IconEdit from '../icons/IconEdit';
import IconDelete from '../icons/IconDelete';
import MiniChip from '../mini_chip';
import React from 'react';
import { StyledCard, StyledCardContent, StyledBox, StyledIconWrapper, StyledBoxSpaceBetween } from './user_card.styles';

export const CPEUserCard = ({ name, onEdit, onDelete, chipLabels, children }: CPEUserCardProps) => {
  return (
    <>
      <StyledCard>
        <StyledCardContent>
          <StyledBox gap="13px" sx={{ flexWrap: 'nowrap' }}>
            <StyledBox gap="12px">
              <Box>
                <UserCardImg />
              </Box>

              <StyledBoxSpaceBetween flexDirection="column">
                <StyledBoxSpaceBetween flexDirection="row">
                  <StyledBoxSpaceBetween flexDirection="column">
                    <Typography
                      sx={{
                        fontFamily: 'Inter',
                        fontSize: '16px',
                        fontStyle: 'normal',
                        fontWeight: '550',
                        lineHeight: '20px',
                      }}
                      gutterBottom
                    >
                      {name}
                    </Typography>
                  </StyledBoxSpaceBetween>
                  <StyledBox sx={{ flexGrow: '1', flexDirection: 'row-reverse' }}>
                    <StyledBox gap="16px">
                      <StyledIconWrapper hoverBackgrColor="var(--accent-150)" iconColor="var(--accent-main)">
                        <Box onClick={() => onEdit()}>
                          <IconEdit />
                        </Box>
                      </StyledIconWrapper>

                      <StyledIconWrapper hoverBackgrColor="var(--red-secondary)" iconColor="var(--red-main)">
                        <Box onClick={() => onDelete()}>
                          <IconDelete />
                        </Box>
                      </StyledIconWrapper>
                    </StyledBox>
                  </StyledBox>
                </StyledBoxSpaceBetween>
                <StyledBox gap="8px" sx={{ flexWrap: 'wrap' }}>
                  {children}
                </StyledBox>
              </StyledBoxSpaceBetween>
            </StyledBox>
          </StyledBox>

          <StyledBox gap="13px">
            <StyledBox gap="8px" sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              {chipLabels.map((chipLabel, index) => (
                <MiniChip key={index.toString()} label={chipLabel} />
              ))}
            </StyledBox>
          </StyledBox>
        </StyledCardContent>
      </StyledCard>
    </>
  );
};
