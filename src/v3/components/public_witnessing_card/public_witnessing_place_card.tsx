import { Stack } from '@mui/material';
import { IconArrowLink, IconNormalPin, IconDelete } from '@icons/index';
import Typography from '@components/typography';
import { PublicWitnessingPlaceCardProps } from './public_witnessing_card.types';
import { CardWrapper, StyledIconWrapper } from './public_witnessing_card.styles';

const CustomPublicWitnessingPlaceCard = ({
  label,
  onClick,
  disabled,
  isDelete = false,
  onDelete,
}: PublicWitnessingPlaceCardProps) => {
  return (
    <CardWrapper
      style={{
        height: '72px',
        backgroundColor: 'var(--white)',
        borderColor: 'var(--accent-300)',
        padding: '10px 15px',
      }}
      view={'accent'}
      component="div"
      disabled={disabled}
      hoverChildColor={isDelete ? 'var(--red-secondary)' : 'var(--accent-150)'}
    >
      <Stack
        style={{
          width: '100%',
        }}
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Stack direction={'row'} spacing={1} alignItems={'center'}>
          <IconNormalPin color={'var(--black)'} />
          <Typography className={'h2'}>{label}</Typography>
        </Stack>
        <StyledIconWrapper
          color={isDelete ? 'var(--red-main)' : 'var(--accent-main)'}
          onClick={() => {
            isDelete && onDelete && onDelete();
            onClick && onClick();
          }}
        >
          {isDelete ? <IconDelete color={'var(--red-main)'} /> : <IconArrowLink color={'var(--accent-main)'} />}
        </StyledIconWrapper>
      </Stack>
    </CardWrapper>
  );
};
export default CustomPublicWitnessingPlaceCard;
