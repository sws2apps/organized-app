import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { selectedWeekState } from '@states/schedules';
import { JWLangState, monthNamesState } from '@states/app';
import { useAppTranslation } from '@hooks/index';
import { sourcesState } from '@states/sources';
import { userDataViewState } from '@states/settings';

const useMidweekEditor = () => {
  const { t } = useAppTranslation();

  const selectedWeek = useRecoilValue(selectedWeekState);
  const monthNames = useRecoilValue(monthNamesState);
  const sources = useRecoilValue(sourcesState);
  const lang = useRecoilValue(JWLangState);
  const dataView = useRecoilValue(userDataViewState);

  const [weekDateLocale, setWeekDateLocale] = useState('');
  const [hasSource, setHasSource] = useState(false);
  const [ayfCount, setAyfCount] = useState(1);
  const [lcCount, setLcCount] = useState(1);

  useEffect(() => {
    if (selectedWeek.length > 0) {
      const weekDate = new Date(selectedWeek);
      const month = weekDate.getMonth();
      const date = weekDate.getDate();

      const monthName = monthNames[month];

      const weekDateLocale = t('tr_longDateNoYearLocale', { date, month: monthName });
      setWeekDateLocale(weekDateLocale);
    }
  }, [t, selectedWeek, monthNames]);

  useEffect(() => {
    if (selectedWeek.length > 0) {
      const source = sources.find((record) => record.weekOf === selectedWeek);
      const weekDate = source.midweek_meeting.week_date_locale[lang];

      if (weekDate) {
        setHasSource(true);

        setAyfCount(source.midweek_meeting.ayf_count[lang]);

        const lcCountOverride = source.midweek_meeting.lc_count.override.find((record) => record.type === dataView);
        if (lcCountOverride?.value > 0) {
          setLcCount(lcCountOverride.value);
        } else {
          setLcCount(source.midweek_meeting.lc_count.default[lang]);
        }
      } else {
        setHasSource(false);
      }
    }
  }, [selectedWeek, sources, lang, dataView]);

  return { weekDateLocale, selectedWeek, hasSource, ayfCount, lcCount };
};

export default useMidweekEditor;
