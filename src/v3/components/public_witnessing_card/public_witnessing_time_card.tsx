import { useMediaQuery } from '@mui/material';
import { CardWrapper } from './public_witnessing_card.styles';
import PublicWitnessingDayView from './view/day';
import PublicWitnessingDefaultView from './view/default';
import { PublicWitnessingCardProps } from './public_witnessing_card.types';

const CPEPublicWitnessingTimeCard = (props: PublicWitnessingCardProps) => {
  const { witnesses, needWitnesses, isDay = false, isPast = false } = props;
  const tablet = useMediaQuery('(max-width:770px)');
  const isContent = !!witnesses && !!needWitnesses;

  const getVariant = () => {
    if (isPast) return isContent ? 'silver' : 'disabled';
    if (!isContent) return 'accent';
    if (witnesses.length < needWitnesses) return 'orange';
    return 'dashed';
  };

  return (
    <CardWrapper
      view={getVariant()}
      component="div"
      disableRipple={getVariant() === 'disabled' || getVariant() === 'dashed' || getVariant() === 'silver'}
    >
      {isDay && !tablet ? (
        <PublicWitnessingDayView {...props} variant={getVariant()} isContent={isContent} />
      ) : (
        <PublicWitnessingDefaultView {...props} variant={getVariant()} isContent={isContent} />
      )}
    </CardWrapper>
  );
};

export default CPEPublicWitnessingTimeCard;
