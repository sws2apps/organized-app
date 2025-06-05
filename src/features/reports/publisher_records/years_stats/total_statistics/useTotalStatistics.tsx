import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { buildServiceYearsList } from '@utils/date';
import { monthNamesState } from '@states/app';
import { TotalStatisticsProps } from './index.types';
import usePersons from '@features/persons/hooks/usePersons';
import usePerson from '@features/persons/hooks/usePerson';
import useReportYearly from '@features/reports/hooks/useReportYearly';

const useTotalStatistics = ({ year, publisherGroup }: TotalStatisticsProps) => {
  const { t } = useAppTranslation();

  const { getPublisherAllYears, getPublishersActive, getAPMonths } =
    usePersons();

  const {
    personIsPrivilegeYearActive,
    personIsEnrollmentYearActive,
    personIsAPContinuousYearActive,
  } = usePerson();

  const { getReportsYear } = useReportYearly();

  const monthNames = useAtomValue(monthNamesState);

  const [expanded, setExpanded] = useState<string | false>(false);

  const service_years = useMemo(() => {
    return buildServiceYearsList();
  }, []);

  // Helper to filter persons by group
  const filterByGroup = (persons) => {
    if (publisherGroup === 'all') return persons;
    return persons.filter((p) =>
      p.person_data.groups?.includes(publisherGroup)
    );
  };

  const publishers_list = useMemo(() => {
    const result = getPublisherAllYears(year);
    return filterByGroup(result);
  }, [year, getPublisherAllYears, publisherGroup]);

  const publishers_total = useMemo(() => {
    const count = publishers_list.length;
    return count;
  }, [publishers_list]);

  const publishers_active = useMemo(() => {
    const lastMonth = `${year}/08`;
    const count = getPublishersActive(lastMonth).length;

    return count;
  }, [year, getPublishersActive]);

  const publishers_inactive = useMemo(() => {
    return publishers_total - publishers_active;
  }, [publishers_total, publishers_active]);

  const elders_count = useMemo(() => {
    const result = publishers_list.filter((person) => {
      const isElder = personIsPrivilegeYearActive(person, 'elder', year);
      return isElder;
    });

    return result.length;
  }, [publishers_list, year, personIsPrivilegeYearActive]);

  const ms_count = useMemo(() => {
    const result = publishers_list.filter((person) => {
      const isMS = personIsPrivilegeYearActive(person, 'ms', year);
      return isMS;
    });

    return result.length;
  }, [publishers_list, year, personIsPrivilegeYearActive]);

  const FR_count = useMemo(() => {
    const result = publishers_list.filter((person) => {
      const isActive = personIsEnrollmentYearActive(person, 'FR', year);
      return isActive;
    });

    return result.length;
  }, [publishers_list, year, personIsEnrollmentYearActive]);

  const FS_count = useMemo(() => {
    const result = publishers_list.filter((person) => {
      const isActive = personIsEnrollmentYearActive(person, 'FS', year);
      return isActive;
    });

    return result.length;
  }, [publishers_list, year, personIsEnrollmentYearActive]);

  const FMF_count = useMemo(() => {
    const result = publishers_list.filter((person) => {
      const isActive = personIsEnrollmentYearActive(person, 'FMF', year);
      return isActive;
    });

    return result.length;
  }, [publishers_list, year, personIsEnrollmentYearActive]);

  const AP_continuous_count = useMemo(() => {
    const result = publishers_list.filter((person) => {
      const isActive = personIsAPContinuousYearActive(person, year);
      return isActive;
    });

    return result.length;
  }, [publishers_list, year, personIsAPContinuousYearActive]);

  const AP_monthly = useMemo(() => {
    const values: number[] = [];

    const months = service_years.find((record) => record.year === year).months;

    for (const month of months) {
      const value = getAPMonths(month.value);

      if (value.length > 0) {
        values.push(value.length);
      }
    }

    return values;
  }, [service_years, year, getAPMonths]);

  const AP_max = useMemo(() => {
    const values = AP_monthly.toSorted((a, b) => b - a);

    return values.at(0);
  }, [AP_monthly]);

  const AP_average = useMemo(() => {
    const sum = AP_monthly.reduce((acc, current) => acc + current, 0);

    if (sum === 0) return 0;

    return Math.round(sum / AP_monthly.length);
  }, [AP_monthly]);

  const hopes = useMemo(() => {
    let other_sheep = 0;
    let anointed = 0;

    for (const person of publishers_list) {
      const isAnointed = person.person_data.publisher_baptized.anointed.value;

      if (isAnointed) anointed++;

      if (!isAnointed) other_sheep++;
    }

    return { other_sheep, anointed };
  }, [publishers_list]);

  const gender = useMemo(() => {
    let male = 0;
    let female = 0;

    for (const person of publishers_list) {
      const isMale = person.person_data.male.value;
      const isFemale = person.person_data.female.value;

      if (isMale) male++;

      if (isFemale) female++;
    }

    return { male, female };
  }, [publishers_list]);

  const reports = useMemo(() => {
    return getReportsYear(year);
  }, [getReportsYear, year]);

  const hours_monthly = useMemo(() => {
    const values: { month: string; value: number }[] = [];

    const months = service_years.find((record) => record.year === year).months;

    for (const month of months) {
      const monthReports = reports.filter(
        (record) => record.report_data.report_date === month.value
      );
      const sum = monthReports.reduce(
        (acc, current) => acc + current.report_data.hours.field_service,
        0
      );

      if (sum > 0) {
        values.push({ month: month.value, value: sum });
      }
    }

    return values;
  }, [service_years, reports, year]);

  const hours_total = useMemo(() => {
    return hours_monthly.reduce((acc, current) => acc + current.value, 0);
  }, [hours_monthly]);

  const hours_average = useMemo(() => {
    if (hours_total === 0) return 0;

    return Math.round(hours_total / hours_monthly.length);
  }, [hours_total, hours_monthly]);

  const hours_max = useMemo(() => {
    if (hours_monthly.length === 0) return '';

    const values = hours_monthly.toSorted((a, b) => b.value - a.value);
    const max = values.at(0);

    const monthIndex = +max.month.split('/')[1] - 1;
    const monthname = monthNames[monthIndex];

    return `${max.value} (${monthname})`;
  }, [hours_monthly, monthNames]);

  const studies_monthly = useMemo(() => {
    const values: number[] = [];

    const months = service_years.find((record) => record.year === year).months;

    for (const month of months) {
      const monthReports = reports.filter(
        (record) => record.report_data.report_date === month.value
      );

      const sum = monthReports.reduce(
        (acc, current) => acc + current.report_data.bible_studies,
        0
      );

      if (sum > 0) {
        values.push(sum);
      }
    }

    return values;
  }, [service_years, reports, year]);

  const studies_total = useMemo(() => {
    return studies_monthly.reduce((acc, current) => acc + current, 0);
  }, [studies_monthly]);

  const studies_average = useMemo(() => {
    if (studies_total === 0) return 0;

    return Math.round(studies_total / studies_monthly.length);
  }, [studies_total, studies_monthly]);

  const studies_max = useMemo(() => {
    if (studies_monthly.length === 0) return '';

    const values = studies_monthly.toSorted((a, b) => b - a);
    return values.at(0);
  }, [studies_monthly]);

  const publishers = useMemo(() => {
    const section = {
      id: 'publishers',
      label: t('tr_publishers'),
      value: publishers_total,
      reports: [
        {
          label: t('tr_activePublishers'),
          value: publishers_active,
        },
        {
          label: t('tr_inactivePublishers'),
          value: publishers_inactive,
        },
        {
          label: t('tr_elders'),
          value: elders_count,
        },
        {
          label: t('tr_ministerialServants'),
          value: ms_count,
        },
        {
          label: t('tr_FRs'),
          value: FR_count,
        },
        {
          label: t('tr_FSs'),
          value: FS_count,
        },
        {
          label: t('tr_FMFs'),
          value: FMF_count,
        },
        {
          label: t('tr_auxiliaryPioneersContinuous'),
          value: AP_continuous_count,
        },
        {
          label: t('tr_highestAuxPioNumber'),
          value: AP_max,
        },
        {
          label: t('tr_avgAuxPioMonthly'),
          value: AP_average,
        },
        {
          label: t('tr_otherSheep'),
          value: hopes.other_sheep,
        },
        {
          label: t('tr_anointed'),
          value: hopes.anointed,
        },
        {
          label: t('tr_male'),
          value: gender.male,
        },
        {
          label: t('tr_female'),
          value: gender.female,
        },
      ],
    };

    return section;
  }, [
    t,
    publishers_active,
    publishers_inactive,
    publishers_total,
    elders_count,
    ms_count,
    FR_count,
    FS_count,
    FMF_count,
    AP_continuous_count,
    AP_max,
    AP_average,
    hopes,
    gender,
  ]);

  const hours = useMemo(() => {
    const section = {
      id: 'hours',
      label: t('tr_totalHours'),
      value: hours_total,
      reports: [
        {
          label: t('tr_highestHourNumberMonthly'),
          value: hours_max,
        },
        {
          label: t('tr_avgHoursMonthly'),
          value: hours_average,
        },
      ],
    };

    return section;
  }, [t, hours_total, hours_average, hours_max]);

  const studies = useMemo(() => {
    const section = {
      id: 'studies',
      label: t('tr_bibleStudies'),
      value: studies_total,
      reports: [
        {
          label: t('tr_highestStudiesNumberMonthly'),
          value: studies_max,
        },
        {
          label: t('tr_avgStudiesMonthly'),
          value: studies_average,
        },
      ],
    };

    return section;
  }, [t, studies_total, studies_average, studies_max]);

  const statistics = useMemo(() => {
    const sections = [publishers, hours, studies];

    return sections;
  }, [publishers, hours, studies]);

  const handleExpandedChange = (value: string | false) => setExpanded(value);

  return { statistics, expanded, handleExpandedChange };
};

export default useTotalStatistics;
