import { useMemo, useState } from 'react';
import { currentReportMonth } from '@utils/date';
import { GroupOption, GroupSelectedValue, SelectedOption } from './index.types';
import { useAppTranslation } from '@hooks/index';
import usePersons from '@features/persons/hooks/usePersons';

const useActivePublishers = () => {
  const { t } = useAppTranslation();

  const { getFTSMonths, getAPMonths } = usePersons();

  const [expanded, setExpanded] = useState<string | false>(false);
  const [selected, setSelected] = useState<SelectedOption>({
    FTS: { all: false, persons: [] },
    AP: { all: false, persons: [] },
    other_publishers: { all: false, persons: [] },
  });

  const month = useMemo(() => {
    return currentReportMonth();
  }, []);

  const person_FTS = useMemo(() => {
    return getFTSMonths(month);
  }, [getFTSMonths, month]);

  const person_AP = useMemo(() => {
    return getAPMonths(month);
  }, [getAPMonths, month]);

  const groups = useMemo(() => {
    const result: GroupOption[] = [];

    if (person_FTS.length > 0) {
      result.push({
        group_id: 'FTS',
        group_members: person_FTS,
        group_name: t('tr_fulltimeServants'),
      });
    }

    if (person_AP.length > 0) {
      result.push({
        group_id: 'AP',
        group_members: person_AP,
        group_name: t('tr_APs'),
      });
    }

    return result;
  }, [person_FTS, person_AP, t]);

  const handleExpandedChange = (value: string | false) => setExpanded(value);

  const handleCheckedChange = (value: string, checked: boolean) => {
    const data = structuredClone(selected);

    if (value === 'FTS' || value === 'AP' || value === 'other') {
      const group: GroupSelectedValue = data[value];
      group.all = checked;

      if (!checked) {
        group.persons = [];
      }

      if (checked) {
        if (value === 'FTS') {
          group.persons = person_FTS.map((record) => record.person_uid);
        }
      }
    }

    // handle individual check

    setSelected(data);
  };

  return {
    expanded,
    handleExpandedChange,
    groups,
    selected,
    handleCheckedChange,
  };
};

export default useActivePublishers;
