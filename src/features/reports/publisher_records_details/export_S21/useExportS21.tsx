import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { useAppTranslation } from '@hooks/index';
import { createArrayFromMonths, currentReportMonth } from '@utils/date';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { personsState } from '@states/persons';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { S21CardData, S21CardMonthData } from '@definition/report';
import { JWLangState, monthNamesState } from '@states/app';
import { fullnameOptionState, shortDateFormatState } from '@states/settings';
import { buildPersonFullname } from '@utils/common';
import { PersonType } from '@definition/person';
import { formatDate } from '@services/dateformat';
import usePerson from '@features/persons/hooks/usePerson';
import TemplateS21Doc2in1 from '@views/reports/S21/2in1';

const useExportS21 = () => {
  const { t } = useAppTranslation();

  const { id } = useParams();

  const {
    personIsPrivilegeYearActive,
    personIsEnrollmentYearActive,
    personIsEnrollmentActive,
  } = usePerson();

  const persons = useRecoilValue(personsState);
  const reports = useRecoilValue(congFieldServiceReportsState);
  const lang = useRecoilValue(JWLangState);
  const dateFormat = useRecoilValue(shortDateFormatState);
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const monthNames = useRecoilValue(monthNamesState);

  const [isProcessing, setIsProcessing] = useState(false);

  const years = useMemo(() => {
    const result: string[] = [];
    const currentMonth = currentReportMonth();
    const year = currentMonth.split('/')[0];
    const prevYear = String(+year - 1).toString();

    result.push(prevYear, year);

    return result;
  }, []);

  const person = useMemo(() => {
    return persons.find((record) => record.person_uid === id);
  }, [persons, id]);

  const getPersonData = (
    card: S21CardData,
    person: PersonType,
    year: string
  ) => {
    card.gender = {
      male: person.person_data.male.value,
      female: person.person_data.female.value,
    };

    const birthDate = person.person_data.birth_date.value;
    if (birthDate?.length > 0) {
      card.birth_date = formatDate(new Date(birthDate), dateFormat);
    }

    const baptismDate =
      person.person_data.publisher_baptized.baptism_date.value;
    if (baptismDate?.length > 0) {
      card.baptism_date = formatDate(new Date(baptismDate), dateFormat);
    }

    const isAnointed = person.person_data.publisher_baptized.anointed.value;
    card.hope = { anointed: isAnointed, other_sheep: !isAnointed };

    card.name = buildPersonFullname(
      person.person_data.person_lastname.value,
      person.person_data.person_firstname.value,
      fullnameOption
    );

    const isElder = personIsPrivilegeYearActive(person, 'elder', year);
    const isMS = personIsPrivilegeYearActive(person, 'ms', year);
    card.privileges = { elder: isElder, ms: isElder ? false : isMS };

    const isFMF = personIsEnrollmentYearActive(person, 'FMF', year);
    const isFS = personIsEnrollmentYearActive(person, 'FS', year);
    const isSFTS = isFMF || isFS;
    const isFR = personIsEnrollmentYearActive(person, 'FR', year);
    card.enrollments = { FMF: isFMF, FS: isFS, FR: isSFTS ? false : isFR };
  };

  const getReportData = (
    card: S21CardData,
    person: PersonType,
    year: string
  ) => {
    const startMonth = `${+year - 1}/09`;
    const endMonth = `${+year}/08`;

    card.months = [];

    const months = createArrayFromMonths(startMonth, endMonth);

    for (const month of months) {
      const obj: S21CardMonthData = {
        AP: false,
        bible_studies: '',
        hours: '',
        month_name: monthNames[+month.split('/')[1] - 1],
        remarks: '',
        shared: false,
      };

      const report = reports.find(
        (record) =>
          record.report_data.report_date === month &&
          record.report_data.person_uid === person.person_uid
      );

      if (report) {
        obj.AP = personIsEnrollmentActive(person, 'AP', month);
        obj.bible_studies = report.report_data.bible_studies.toString();
        obj.hours = report.report_data.hours.field_service.toString();
        obj.shared = report.report_data.shared_ministry;

        let comments = report.report_data.comments;

        const approvedAssignments = report.report_data.hours.credit.value;
        const credits = report.report_data.hours.credit.approved;

        if (approvedAssignments > 0) {
          if (comments.length === 0) comments += '; ';
          comments += `${t('tr_approvedAssignments')}: ${approvedAssignments}`;
        }

        if (credits > 0) {
          if (comments.length === 0) comments += '; ';
          comments += `${t('tr_credit')}: ${credits}`;
        }

        obj.remarks = comments;
      }

      card.months.push(obj);
    }

    const total_hours = card.months.reduce(
      (acc, current) => acc + +current.hours,
      0
    );

    card.hours_total = total_hours.toString();
  };

  const getCardsData = () => {
    const result: S21CardData[] = [];

    for (const year of years) {
      const obj = {} as S21CardData;
      obj.year = year;
      obj.lang = lang;
      getPersonData(obj, person, year);
      getReportData(obj, person, year);

      result.push(obj);
    }

    return result;
  };

  const handleExport = async () => {
    if (!person) return;

    try {
      setIsProcessing(true);

      const data = getCardsData();

      const newData = data as [S21CardData, S21CardData];
      const blob = await pdf(<TemplateS21Doc2in1 data={newData} />).toBlob();

      const filename = `S-21_${data.at(0).name}.pdf`;

      saveAs(blob, filename);

      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);

      console.error(error);

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { years, handleExport, isProcessing };
};

export default useExportS21;
