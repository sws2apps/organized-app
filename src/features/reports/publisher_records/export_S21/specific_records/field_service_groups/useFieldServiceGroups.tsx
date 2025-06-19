import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { TreeViewBaseItem } from '@mui/x-tree-view';
import { currentReportMonth } from '@utils/date';
import { useAppTranslation } from '@hooks/index';
import { fullnameOptionState } from '@states/settings';
import { buildPersonFullname } from '@utils/common';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import { personsState } from '@states/persons';
import { FieldServiceGroupsProps } from './index.types';
import usePersons from '@features/persons/hooks/usePersons';

const useFieldServiceGroups = ({ onExport }: FieldServiceGroupsProps) => {
  const { t } = useAppTranslation();

  const { getPublishersActive } = usePersons();

  const fullnameOption = useAtomValue(fullnameOptionState);
  const fieldGroups = useAtomValue(fieldWithLanguageGroupsState);
  const persons = useAtomValue(personsState);

  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const month = useMemo(() => {
    return currentReportMonth();
  }, []);

  const active_publishers = useMemo(() => {
    if (fieldGroups.length === 0) return [];

    const persons = getPublishersActive(month);

    const result: FieldServiceGroupType[] = [];

    for (const group of fieldGroups) {
      const members = group.group_data.members.filter((record) =>
        persons.some((person) => record.person_uid === person.person_uid)
      );

      if (members.length > 0) {
        const obj = structuredClone(group);

        obj.group_data.members = members;
        result.push(obj);
      }
    }

    return result.sort(
      (a, b) => a.group_data.sort_index - b.group_data.sort_index
    );
  }, [fieldGroups, getPublishersActive, month]);

  const groups = useMemo(() => {
    const result: TreeViewBaseItem[] = active_publishers.map((group, index) => {
      let group_name = group.group_data.name ?? '';

      if (group_name.length === 0) {
        group_name = t('tr_groupName', {
          groupName: String(group.group_data.sort_index + 1),
        });
      }

      return {
        id: `group-${index}`,
        label: group_name,
        children: group.group_data.members
          .map((member) => {
            const person = persons.find(
              (record) => record.person_uid === member.person_uid
            );

            return {
              id: person.person_uid,
              label: buildPersonFullname(
                person.person_data.person_lastname.value,
                person.person_data.person_firstname.value,
                fullnameOption
              ),
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label))
          .filter((record) =>
            record.label.toLowerCase().includes(search.toLowerCase())
          ),
      };
    });

    return result;
  }, [t, fullnameOption, persons, active_publishers, search]);

  const btnLabel = useMemo(() => {
    let label = t('tr_export');
    if (selected.length === 0) return label;

    const cn = selected.filter((record) => record.includes('group') === false);

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
    await onExport(selected, 'groups');
  };

  return {
    groups,
    handleSelectionChange,
    selected,
    btnLabel,
    handleSearchChange,
    search,
    handleExport,
    isProcessing,
  };
};

export default useFieldServiceGroups;
