import { Stack } from '@mui/material';
import Typography from '@components/typography';
import { IconPersonSearch } from '@icons/index';
import { PublicWitnessingViewProps } from '../public_witnessing_card.types';
import { colorVariants } from '@components/public_witnessing_card/public_witnessing_card.styles';

/**
 * Component for rendering the day view of public witnessing.
 * @param props - Component props.
 * @returns JSX element representing the day view of public witnessing.
 */
const PublicWitnessingDayView = (props: PublicWitnessingViewProps) => {
  const { witnesses, needWitnesses, isContent, variant, label } = props;

  return (
    <Stack
      style={{ width: '100%' }}
      direction={'row'}
      justifyContent={'space-between'}
    >
      <Typography
        sx={{ marginRight: '15px', whiteSpace: 'nowrap' }}
        className={'body-small-semibold'}
        color={colorVariants[variant]}
      >
        {label}
      </Typography>
      {witnesses ? (
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          style={{ width: '100%' }}
        >
          <Stack direction={'row'} spacing={1}>
            {witnesses
              ? witnesses.map((x, index) => (
                  <Typography
                    key={index}
                    className={'body-small-semibold'}
                    color={colorVariants[variant]}
                  >
                    {index + 1 < witnesses.length ? `${x},` : x}
                  </Typography>
                ))
              : null}
          </Stack>
          {isContent && witnesses.length < needWitnesses ? (
            <Stack direction={'row'} alignItems={'center'}>
              <IconPersonSearch
                color={'var(--orange-dark)'}
                width={20}
                height={20}
              />
              <Typography
                className={'label-small-medium'}
                color={
                  witnesses.length < needWitnesses
                    ? 'var(--orange-dark)'
                    : 'var(--accent-400)'
                }
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
