import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { monthNamesState } from '@states/app';
import {
  fullnameOptionState,
  JWLangState,
  settingsState,
} from '@states/settings';
import { personsState } from '@states/persons';
import { buildPersonFullname } from '@utils/common';
import {
  addMonths,
  createArrayFromMonths,
  currentMonthServiceYear,
} from '@utils/date';
import { formatDate } from '@services/dateformat';
import { ApplicationFormProps } from '../index.types';

const useFormBody = ({ application, onChange }: ApplicationFormProps) => {
  const { t } = useAppTranslation();

  const location = useLocation();

  const { isPublisher, isServiceCommittee } = useCurrentUser();

  const lang = useRecoilValue(JWLangState);
  const settings = useRecoilValue(settingsState);
  const persons = useRecoilValue(personsState);
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const months = useRecoilValue(monthNamesState);

  const isPublisherAP = useMemo(() => {
    return location.pathname === '/auxiliary-pioneer-application';
  }, [location]);

  const form_readOnly = useMemo(() => {
    return (
      (isPublisherAP && !isPublisher) || (!isPublisherAP && !isServiceCommittee)
    );
  }, [isPublisherAP, isPublisher, isServiceCommittee]);

  const moral_text = useMemo(() => {
    let text = t('tr_pioneerApplicationMoral');

    text = text.replace(
      "href=''",
      `href="https://www.jw.org/finder?wtlocale=${lang}&docid=202013206"`
    );

    return text;
  }, [t, lang]);

  const coordinator = useMemo(() => {
    const id = settings.cong_settings.responsabilities.coordinator;
    const person = persons.find((record) => record.person_uid === id);

    if (!person) return '';

    return buildPersonFullname(
      person.person_data.person_lastname.value,
      person.person_data.person_firstname.value,
      fullnameOption
    );
  }, [settings, persons, fullnameOption]);

  const secretary = useMemo(() => {
    const id = settings.cong_settings.responsabilities.secretary;
    const person = persons.find((record) => record.person_uid === id);

    if (!person) return '';

    return buildPersonFullname(
      person.person_data.person_lastname.value,
      person.person_data.person_firstname.value,
      fullnameOption
    );
  }, [settings, persons, fullnameOption]);

  const service = useMemo(() => {
    const id = settings.cong_settings.responsabilities.service;
    const person = persons.find((record) => record.person_uid === id);

    if (!person) return '';

    return buildPersonFullname(
      person.person_data.person_lastname.value,
      person.person_data.person_firstname.value,
      fullnameOption
    );
  }, [settings, persons, fullnameOption]);

  const monthOptions = useMemo(() => {
    const thisMonth = currentMonthServiceYear();
    const lastMonth = formatDate(addMonths(`${thisMonth}/01`, 6), 'yyyy/MM');

    const options = createArrayFromMonths(thisMonth, lastMonth);

    const data = options.map((record) => {
      const month = +record.split('/')[1] - 1;

      return { label: months[month], value: record };
    });

    return data;
  }, [months]);

  const handleSetDate = (value: Date) => {
    const form = structuredClone(application);
    form.date = value;

    onChange(form);
  };

  const handleSetName = (value: string) => {
    const form = structuredClone(application);
    form.name = value;

    onChange(form);
  };

  const handleSetMonths = (value: string[]) => {
    const form = structuredClone(application);

    if (form.continuous && value.length >= 1) {
      form.months = [value.at(-1)];
    }

    if (!form.continuous) {
      form.months = value.toSorted();
    }

    onChange(form);
  };

  const handleFormatMonths = (values: string[]) => {
    const months = values
      .toSorted()
      .map((value) => {
        const month = monthOptions.find((record) => record.value === value);
        return month.label;
      })
      .join(', ');

    return months;
  };

  const handleToggleContinuous = (value: boolean) => {
    const form = structuredClone(application);
    form.continuous = value;

    if (value && form.months.length > 1) {
      form.months = [form.months.at(0)];
    }

    onChange(form);
  };

  return {
    moral_text,
    coordinator,
    secretary,
    service,
    handleSetDate,
    application,
    handleSetName,
    monthOptions,
    handleSetMonths,
    handleFormatMonths,
    handleToggleContinuous,
    form_readOnly,
  };
};

export default useFormBody;
