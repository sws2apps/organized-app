import Divider from '@components/divider';
import { IconCalendarWeek } from '@components/icons';
import Typography from '@components/typography';
import { Stack } from '@mui/material';
import { monthNamesState } from '@states/app';
import { congSpecialMonthsState } from '@states/settings';
import { useAtomValue } from 'jotai';
import { ReactNode, useMemo } from 'react';

const useSWMonthsOfSpecialActivity = () => {
  const monthNames = useAtomValue(monthNamesState);
  const specialMonthsData = useAtomValue(congSpecialMonthsState);

  const noMonths = useMemo(
    () =>
      specialMonthsData.length == 0 ||
      !specialMonthsData.every((year) => year._deleted),
    [specialMonthsData]
  );

  const latestUpdatedAt = useMemo(
    () =>
      specialMonthsData.reduce<string | null>((latest, special) => {
        if (!latest) return special.updatedAt;

        return new Date(special.updatedAt) > new Date(latest)
          ? special.updatedAt
          : latest;
      }, null),
    [specialMonthsData]
  );

  const specialMonths: ReactNode = useMemo(() => {
    const items = specialMonthsData.flatMap((special) =>
      special.months.toSorted().map((value) => {
        const monthName = monthNames[Number(value.split('/')[1]) - 1];

        return (
          <Stack
            key={`${special.year}-${value}`}
            direction="row"
            spacing="8px"
            alignItems="center"
          >
            <IconCalendarWeek color="var(--black)" />
            <Typography className="body-regular">
              {`${monthName} ${special.year}`}
            </Typography>
          </Stack>
        );
      })
    );

    return items.flatMap((item, index) =>
      index === items.length - 1
        ? [item]
        : [item, <Divider key={`divider-${index}`} color="var(--accent-200)" />]
    );
  }, [monthNames, specialMonthsData]);

  return { specialMonths, latestUpdatedAt, noMonths };
};

export default useSWMonthsOfSpecialActivity;
