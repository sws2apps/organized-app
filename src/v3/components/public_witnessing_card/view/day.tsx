import { Stack } from '@mui/material';
import Typography from '@components/typography';
import { IconPerson } from '@icons/index';
import { PublicWitnessingViewProps } from '../public_witnessing_card.types';

const PublicWitnessingDayView = (props: PublicWitnessingViewProps) => {
  const { witnesses, needWitnesses, disabled, isContent, ...rest } = props;
  return (
    <Stack style={{ width: '100%' }} direction={'row'}>
      <Typography
        sx={{ marginRight: '15px', textWrap: 'nowrap' }}
        className={'body-small-semibold'}
        color={
          disabled
            ? 'var(--grey-300)'
            : isContent && witnesses.length < needWitnesses
              ? 'var(--orange-dark)'
              : isContent && witnesses.length === needWitnesses
                ? 'var(--accent-400)'
                : 'var(--accent-dark)'
        }
      >
        {rest.label}
      </Typography>
      {witnesses ? (
        <Stack direction={'row'} justifyContent={'space-between'} style={{ width: '100%' }}>
          <Stack direction={'row'} spacing={1}>
            {witnesses
              ? witnesses.map((x, index) => (
                  <Typography
                    key={index}
                    className={'body-small-semibold'}
                    color={witnesses.length < needWitnesses ? 'var(--orange-dark)' : 'var(--accent-400)'}
                  >
                    {index + 1 < witnesses.length ? `${x},` : x}
                  </Typography>
                ))
              : null}
          </Stack>
          {isContent && witnesses.length < needWitnesses ? (
            <Stack direction={'row'} alignItems={'center'}>
              <IconPerson color={'var(--orange-dark)'} width={20} height={20} />
              <Typography
                className={'label-small-medium'}
                color={witnesses.length < needWitnesses ? 'var(--orange-dark)' : 'var(--accent-400)'}
              >
                Partner needed
              </Typography>
            </Stack>
          ) : null}
        </Stack>
      ) : null}
    </Stack>
  );
};

export default PublicWitnessingDayView;
