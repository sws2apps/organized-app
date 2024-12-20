import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { sourcesState } from '@states/sources';
import { JWLangState } from '@states/settings';

const useWeekHeader = (weekOf: string) => {
  const sources = useRecoilValue(sourcesState);
  const lang = useRecoilValue(JWLangState);

  const [header, setHeader] = useState('');

  useEffect(() => {
    if (weekOf.length > 0) {
      const source = sources.find((record) => record.weekOf === weekOf);
      const weekDate = source.midweek_meeting.week_date_locale[lang];
      const bibleReading = source.midweek_meeting.weekly_bible_reading[lang];

      setHeader(`${weekDate} | ${bibleReading}`);
    }
  }, [weekOf, sources, lang]);

  return { header };
};

export default useWeekHeader;
