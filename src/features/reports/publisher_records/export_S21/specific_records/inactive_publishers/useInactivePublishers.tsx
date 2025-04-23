import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { TreeViewBaseItem } from '@mui/x-tree-view';
import { currentReportMonth } from '@utils/date';
import { useAppTranslation } from '@hooks/index';
import { fullnameOptionState } from '@states/settings';
import { buildPersonFullname } from '@utils/common';
import { InactivePublishersProps } from './index.types';
import usePersons from '@features/persons/hooks/usePersons';

const useInactivePublishers = ({ onExport }: InactivePublishersProps) => {
  const { t } = useAppTranslation();

  const { getPublishersInactive } = usePersons();

  const fullnameOption = useAtomValue(fullnameOptionState);

  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const month = useMemo(() => {
    return currentReportMonth();
  }, []);

  const person_publishers = useMemo(() => {
    return getPublishersInactive(month);
  }, [getPublishersInactive, month]);

  const groups = useMemo(() => {
    const result: TreeViewBaseItem[] = [];

    if (person_publishers.length > 0) {
      result.push({
        id: 'inactive_all',
        label: t('tr_selectAll'),
        children: person_publishers
          .map((person) => {
            return {
              id: person.person_uid,
              label: buildPersonFullname(
                person.person_data.person_lastname.value,
                person.person_data.person_firstname.value,
                fullnameOption
              ),
            };
          })
          .filter((record) =>
            record.label.toLowerCase().includes(search.toLowerCase())
          ),
      });
    }

    return result;
  }, [person_publishers, t, fullnameOption, search]);

  const btnLabel = useMemo(() => {
    let label = t('tr_export');
    if (selected.length === 0) return label;

    const cn = selected.filter((record) => record !== 'inactive_all');

    label += `: ${cn.length}`;

    return label;
  }, [selected, t]);

  const handleSearchChange = (value: string) => setSearch(value);

  const handleSelectionChange = (newSelectedItems: string[]) => {
    setSelected(newSelectedItems);
  };

  const handleExport = async () => {
    if (selected.length === 0) return;

    setIsProcessing(true);
    await onExport(selected, 'inactive');
  };

  return {
    groups,
    handleSelectionChange,
    selected,
    btnLabel,
    handleSearchChange,
    search,
    isProcessing,
    handleExport,
  };
};

export default useInactivePublishers;
