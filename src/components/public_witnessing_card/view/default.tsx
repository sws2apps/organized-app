import Accordion from '@components/accordion';
import { Stack } from '@mui/material';
import Typography from '@components/typography';
import { IconPersonSearch } from '@icons/index';
import { PublicWitnessingViewProps } from '../public_witnessing_card.types';
import { colorVariants } from '@components/public_witnessing_card/public_witnessing_card.styles';

/**
 * Component for rendering the default view of public witnessing.
 * @param props - Component props.
 * @returns JSX element representing the default view of public witnessing.
 */
const PublicWitnessingDefaultView = (props: PublicWitnessingViewProps) => {
  const { variant, witnesses, needWitnesses, isContent, ...rest } = props;

  return (
    <Accordion {...rest} variant={variant}>
      {witnesses ? (
        <Stack direction={'column'}>
          {witnesses
            ? witnesses.map((x, index) => (
                <Typography
                  key={index}
                  className={'body-small-semibold'}
                  color={colorVariants[variant]}
                >
                  {x}
                </Typography>
              ))
            : null}
          {isContent && witnesses.length < needWitnesses ? (
            <Stack direction={'row'} alignItems={'center'}>
              <IconPersonSearch
                color={'var(--orange-dark)'}
                width={20}
                height={20}
              />
              <Typography
                className={'label-small-medium'}
                color="var(--orange-dark)"
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
