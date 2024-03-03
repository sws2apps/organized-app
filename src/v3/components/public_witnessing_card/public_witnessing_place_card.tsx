import { Stack } from '@mui/material';
import { IconArrowLink, IconDelete, IconEdit, IconPin } from '@icons/index';
import Typography from '@components/typography';
import { PublicWitnessingPlaceCardProps } from './public_witnessing_card.types';
import { CardWrapper, StyledIconWrapper } from './public_witnessing_card.styles';

const CPEPublicWitnessingPlaceCard = ({
  label,
  isEdit,
  onEditClick,
  onDeleteClick,
  onClick,
  disabled,
}: PublicWitnessingPlaceCardProps) => {
  return (
    <CardWrapper view={'default'} component="div" disabled={disabled}>
      <Stack style={{ width: '100%' }} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <Stack direction={'row'} spacing={1} alignItems={'center'}>
          <IconPin color={'var(--black)'} />
          <Typography className={'h2'}>{label}</Typography>
        </Stack>
        <>
          {isEdit ? (
            <Stack direction={'row'} spacing={1}>
              <StyledIconWrapper
                onClick={() => {
                  onEditClick && onEditClick();
                }}
              >
                <IconDelete color={'var(--red-main)'} />
              </StyledIconWrapper>
              <StyledIconWrapper
                onClick={() => {
                  onDeleteClick && onDeleteClick();
                }}
              >
                <IconEdit color={'var(--accent-dark)'} />
              </StyledIconWrapper>
            </Stack>
          ) : (
            <StyledIconWrapper
              onClick={() => {
                !isEdit && onClick && onClick();
              }}
            >
              <IconArrowLink color={'var(--accent-main)'} />
            </StyledIconWrapper>
          )}
        </>
      </Stack>
    </CardWrapper>
  );
};
export default CPEPublicWitnessingPlaceCard;
