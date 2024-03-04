import Accordion from '@components/accordion';
import { Stack } from '@mui/material';
import Typography from '@components/typography';
import { IconPersonSearch } from '@icons/index';
import { PublicWitnessingViewProps } from '../public_witnessing_card.types';

const PublicWitnessingDefaultView = (props: PublicWitnessingViewProps) => {
  const { witnesses, needWitnesses, isContent, ...rest } = props;
  return (
    <Accordion
      {...rest}
      variant={
        isContent && witnesses.length < needWitnesses
          ? 'searching'
          : isContent && witnesses.length
            ? 'dashed'
            : 'default'
      }
    >
      {witnesses ? (
        <Stack direction={'column'}>
          {witnesses
            ? witnesses.map((x, index) => (
                <Typography
                  key={index}
                  className={'body-small-semibold'}
                  color={witnesses.length < needWitnesses ? 'var(--orange-dark)' : 'var(--accent-400)'}
                >
                  {x}
                </Typography>
              ))
            : null}
          {isContent && witnesses.length < needWitnesses ? (
            <Stack direction={'row'} alignItems={'center'}>
              <IconPersonSearch color={'var(--orange-dark)'} width={20} height={20} />
              <Typography
                className={'label-small-medium'}
                color={isContent && witnesses.length < needWitnesses ? 'var(--orange-dark)' : 'var(--accent-400)'}
              >
                Partner needed
              </Typography>
            </Stack>
          ) : null}
        </Stack>
      ) : null}
    </Accordion>
  );
};

export default PublicWitnessingDefaultView;
