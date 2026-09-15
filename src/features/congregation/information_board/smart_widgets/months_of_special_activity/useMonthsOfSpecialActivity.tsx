import { monthNamesState } from '@states/app';
import { congSpecialMonthsState } from '@states/settings';
import { useAtomValue } from 'jotai';
import { ReactNode, useMemo } from 'react';
import Divider from '@components/divider';
import { Stack } from '@mui/material';
import { IconCalendarWeek } from '@components/icons';
import Typography from '@components/typography';

const useSWMonthsOfSpecialActivity = () => {
  const monthNames = useAtomValue(monthNamesState);
  const specialMonthsData = useAtomValue(congSpecialMonthsState);

  const activeSpecialMonths = useMemo(
    () => specialMonthsData.filter((special) => !special._deleted),
    [specialMonthsData]
  );

  const noMonths = activeSpecialMonths.length === 0;

  const latestUpdatedAt = useMemo(
    () =>
      activeSpecialMonths.reduce<string | null>((latest, special) => {
        if (!latest) return special.updatedAt;

        return new Date(special.updatedAt) > new Date(latest)
          ? special.updatedAt
          : latest;
      }, null),
    [activeSpecialMonths]
  );

  const specialMonths: ReactNode = useMemo(() => {
    const items = activeSpecialMonths.flatMap((special) =>
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
  }, [activeSpecialMonths, monthNames]);

  return { specialMonths, latestUpdatedAt, noMonths };
};

export default useSWMonthsOfSpecialActivity;
