import Badge from '@components/badge';
import Divider from '@components/divider';
import { IconPerson } from '@components/icons';
import Typography from '@components/typography';
import usePerson from '@features/persons/hooks/usePerson';
import { useAppTranslation } from '@hooks/index';
import { Stack } from '@mui/material';
import { personIsAP } from '@services/app/persons';
import { personsActiveState } from '@states/persons';
import { fullnameOptionState } from '@states/settings';
import { buildPersonFullname } from '@utils/common';
import { useAtomValue } from 'jotai';
import { Fragment, useMemo } from 'react';

const useSWAuxiliaryPioneers = () => {
  const { t } = useAppTranslation();
  const { personIsAPContinuousYearActive } = usePerson();

  const activePersons = useAtomValue(personsActiveState);
  const fullnameOption = useAtomValue(fullnameOptionState);

  const filteredAuxiliaryPioneers = useMemo(
    () => activePersons.filter((person) => personIsAP(person)),
    [activePersons]
  );

  const lastUpdated = useMemo(() => {
    let latest = -Infinity;

    for (const person of filteredAuxiliaryPioneers) {
      const updatedAt = person.person_data.enrollments.find(
        (enrollment) => enrollment.enrollment === 'AP'
      )?.updatedAt;

      if (!updatedAt) continue;

      const time = new Date(updatedAt).getTime();
      if (time > latest) latest = time;
    }

    return latest === -Infinity ? undefined : new Date(latest);
  }, [filteredAuxiliaryPioneers]);

  const auxiliaryPioneers = useMemo(
    () =>
      filteredAuxiliaryPioneers.map((pioneer, index) => (
        <Fragment key={pioneer.person_uid}>
          <Stack
            spacing={'8px'}
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Stack spacing={'8px'} direction={'row'} alignItems={'center'}>
              <IconPerson color="var(--black)" />
              <Typography className="body-regular">
                {buildPersonFullname(
                  pioneer.person_data.person_lastname.value,
                  pioneer.person_data.person_firstname.value,
                  fullnameOption
                )}
              </Typography>
            </Stack>
            {personIsAPContinuousYearActive(
              pioneer,
              new Date().getFullYear().toString()
            ) && (
              <Badge text={t('tr_continuous')} color="accent" size="small" />
            )}
          </Stack>
          {index !== filteredAuxiliaryPioneers.length - 1 && (
            <Divider color="var(--accent-200)" />
          )}
        </Fragment>
      )),
    [
      filteredAuxiliaryPioneers,
      fullnameOption,
      personIsAPContinuousYearActive,
      t,
    ]
  );

  return {
    filteredAuxiliaryPioneers,
    auxiliaryPioneers,
    lastUpdated,
  };
};

export default useSWAuxiliaryPioneers;
