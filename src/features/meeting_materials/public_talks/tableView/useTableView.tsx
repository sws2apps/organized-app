import { useMemo } from 'react';
import { TalksTableViewType, TalkTableItemType } from './index.types';

const useTableView = ({ talks }: TalksTableViewType) => {
  const yearslist = useMemo(() => {
    const history = talks.flatMap((talk) => talk.history);

    const years = [...new Set(history.map((item) => item.date.split('/')[0]))];

    return years;
  }, [talks]);

  const talksList = useMemo(() => {
    const results: TalkTableItemType[] = [];

    for (const talk of talks) {
      const obj = {} as TalkTableItemType;
      obj.talk_number = talk.talk_number;
      obj.talk_title = talk.talk_title;
      obj.history = [];

      for (const year of yearslist) {
        const yearHistory = {
          year,
          records: talk.history.filter((record) => record.date.includes(year)),
        };

        obj.history.push(yearHistory);
      }

      results.push(obj);
    }

    return results;
  }, [talks, yearslist]);

  return { talksList, yearslist };
};

export default useTableView;
