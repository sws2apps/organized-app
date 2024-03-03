import { useMediaQuery } from '@mui/material';
import { CardWrapper } from './public_witnessing_card.styles';
import PublicWitnessingDayView from './view/day';
import PublicWitnessingDefaultView from './view/default';
import { PublicWitnessingCardProps } from './public_witnessing_card.types';

const CPEPublicWitnessingTimeCard = (props: PublicWitnessingCardProps) => {
  const { witnesses, needWitnesses, isDay = false, ...rest } = props;
  const tablet = useMediaQuery('(max-width:770px)');
  const isContent = !!witnesses && !!needWitnesses;

  return (
    <CardWrapper
      view={
        isContent && witnesses.length < needWitnesses
          ? 'searching'
          : isContent && witnesses.length === needWitnesses
            ? 'dashed'
            : 'default'
      }
      component="div"
      style={{ borderRadius: 'var(--radius-l)' }}
      disabled={rest.disabled}
    >
      {isDay && !tablet ? (
        <PublicWitnessingDayView {...props} isContent={isContent} />
      ) : (
        <PublicWitnessingDefaultView {...props} isContent={isContent} />
      )}
    </CardWrapper>
  );
};

export default CPEPublicWitnessingTimeCard;
