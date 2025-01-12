import {
  StyledCard,
  StyledCardContent,
  StyledBox,
  StyledIconWrapper,
  StyledBoxSpaceBetween,
  StyledImgContainer,
  StyledCardBox,
} from './user_card.styles';
import type { CustomUserCardProps } from './user_card.types';
import IconDelete from '../icons/IconDelete';
import IconArrowLink from '../icons/IconArrowLink';
import MiniChip from '../mini_chip';
import Typography from '../typography';
import UserCardMaleImg from '@assets/img/illustration_male.svg?component';
import UserCardFemaleImg from '@assets/img/illustration_female.svg?component';

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
const UserCard = ({
  name,
  type,
  female,
  onClick,
  onDelete,
  chipLabels = [],
  children,
  showArrow,
}: CustomUserCardProps) => {
  return (
    <StyledCardBox>
      <StyledCard onClick={() => onClick?.()}>
        <StyledCardContent>
          <StyledBox gap="13px" sx={{ flexWrap: 'nowrap' }}>
            <StyledBox gap="12px" sx={{ width: '100%' }}>
              <StyledImgContainer>
                {female ? <UserCardFemaleImg /> : <UserCardMaleImg />}
              </StyledImgContainer>
              <StyledBoxSpaceBetween flexDirection="column">
                <StyledBoxSpaceBetween flexDirection="row" sx={{ gap: '12px' }}>
                  <StyledBoxSpaceBetween
                    flexDirection="column"
                    sx={{
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      className="h4"
                      sx={{
                        whiteSpace: 'wrap',
                        marginBottom: '4px',
                      }}
                    >
                      {name}
                    </Typography>
                  </StyledBoxSpaceBetween>
                  {type === 'person' && onDelete && (
                    <StyledBox
                      sx={{ flexGrow: '1', flexDirection: 'row-reverse' }}
                    >
                      <StyledBox gap="16px">
                        <StyledIconWrapper
                          hoverBackgrColor="var(--red-secondary)"
                          iconColor="var(--red-main)"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(e);
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
              {(type !== 'person' || showArrow) && (
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

          {type === 'person' && chipLabels.length > 0 && (
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

export default UserCard;
