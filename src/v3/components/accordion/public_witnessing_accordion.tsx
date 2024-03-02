import Accordion from '.';
import { Stack } from '@mui/material';
import Typography from '@components/typography';
import { IconPerson } from '@icons/index';
import { CPEAccordionProps, PublicWitnessingAccordionProps } from '@components/accordion/accordion.types';

const PublicWitnessingAccordion = (props: CPEAccordionProps & PublicWitnessingAccordionProps) => {
  const { witnesses, ...rest } = props;
  return (
    <Accordion
      {...rest}
      variant={witnesses && witnesses.length === 1 ? 'searching' : witnesses && witnesses.length ? 'dashed' : 'default'}
    >
      {witnesses ? (
        <Stack direction={'column'}>
          {witnesses
            ? witnesses.map((x, index) => (
                <Typography
                  key={index}
                  className={'body-small-semibold'}
                  color={witnesses.length === 1 ? 'var(--orange-dark)' : 'var(--accent-400)'}
                >
                  {x}
                </Typography>
              ))
            : null}
          {witnesses && witnesses.length === 1 ? (
            <Stack direction={'row'} alignItems={'center'}>
              <IconPerson color={'var(--orange-dark)'} width={20} height={20} />
              <Typography
                className={'label-small-medium'}
                color={witnesses.length === 1 ? 'var(--orange-dark)' : 'var(--accent-400)'}
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

export default PublicWitnessingAccordion;
