import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { BadgeColor } from '@definition/app';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { monthNamesState } from '@states/app';
import { PersonItemProps } from './index.types';

const usePersonItem = ({ month, person, type }: PersonItemProps) => {
  const navigate = useNavigate();

  const { t } = useAppTranslation();

  const reports = useRecoilValue(congFieldServiceReportsState);
  const monthNames = useRecoilValue(monthNamesState);

  const badges = useMemo(() => {
    if (type === 'active') return;

    const userReports = reports.filter(
      (record) => record.report_data.person_uid === person.person_uid
    );
    if (userReports.length === 0) return;

    // get last report
    userReports.sort((a, b) =>
      b.report_data.report_date.localeCompare(a.report_data.report_date)
    );
    const lastReport = userReports.at(0).report_data.report_date;

    const [year, month] = lastReport.split('/');
    const monthname = monthNames[+month - 1];

    const date = t('tr_monthYear', { month: monthname, year });

    return [
      {
        name: t('tr_publisherLastReport', { month: date }),
        color: 'grey' as BadgeColor,
      },
    ];
  }, [type, reports, person, monthNames, t]);

  const handleOpenPublisher = () => {
    navigate(`/publisher-records/${person.person_uid}`);
  };

  return { handleOpenPublisher, month, person, badges };
};

export default usePersonItem;
