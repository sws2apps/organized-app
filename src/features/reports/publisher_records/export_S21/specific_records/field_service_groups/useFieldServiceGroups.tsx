import { useMemo, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { TreeViewBaseItem } from '@mui/x-tree-view';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { currentReportMonth } from '@utils/date';
import { useAppTranslation } from '@hooks/index';
import { fullnameOptionState } from '@states/settings';
import { buildPersonFullname } from '@utils/common';
import { fieldGroupsState } from '@states/field_service_groups';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import { personsState } from '@states/persons';
import { FieldServiceGroupsProps } from './index.types';
import usePersons from '@features/persons/hooks/usePersons';
import useParentUncheckHandler from '../useParentUncheckHandler';

const useFieldServiceGroups = ({ onExport }: FieldServiceGroupsProps) => {
  const { t } = useAppTranslation();

  const { getPublishersActive } = usePersons();

  const toggledItemRef = useRef<{ [itemId: string]: boolean }>({});

  const apiRef = useTreeViewApiRef();

  const fullnameOption = useRecoilValue(fullnameOptionState);
  const fieldGroups = useRecoilValue(fieldGroupsState);
  const persons = useRecoilValue(personsState);

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
      let group_name = t('tr_groupName', { groupName: index + 1 });

      if (group.group_data.name.length > 0) {
        group_name += ` — ${group.group_data.name}`;
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

  const getItemDescendantsIds = (item: TreeViewBaseItem) => {
    const ids: string[] = [];

    item.children?.forEach((child) => {
      ids.push(child.id);
      ids.push(...getItemDescendantsIds(child));
    });

    return ids;
  };

  const handleItemSelectionToggle = (itemId: string, isSelected: boolean) => {
    toggledItemRef.current[itemId] = isSelected;
  };

  const { deleteSelectionFromParentItem } = useParentUncheckHandler(
    groups,
    selected
  );

  const handleSelectionChange = (newSelectedItems: string[]) => {
    setSelected(newSelectedItems);

    // Select / unselect the children of the toggled item
    const itemsToSelect: string[] = [];
    const itemsToUnSelect: { [itemId: string]: boolean } = {};

    Object.entries(toggledItemRef.current).forEach(([itemId, isSelected]) => {
      const item = apiRef.current.getItem(itemId);
      if (isSelected) {
        itemsToSelect.push(...getItemDescendantsIds(item));
      } else {
        getItemDescendantsIds(item).forEach((descendantId) => {
          itemsToUnSelect[descendantId] = true;
        });
      }
    });

    const newSelectedItemsWithChildren = Array.from(
      new Set(
        [...newSelectedItems, ...itemsToSelect].filter(
          (itemId) => !itemsToUnSelect[itemId]
        )
      )
    );

    // remove parent check if at least one child element has been unchecked.
    const selectedItemsWithoutParent = deleteSelectionFromParentItem(
      newSelectedItemsWithChildren
    );

    setSelected(selectedItemsWithoutParent);

    toggledItemRef.current = {};
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
    apiRef,
    handleItemSelectionToggle,
    btnLabel,
    handleSearchChange,
    search,
    handleExport,
    isProcessing,
  };
};

export default useFieldServiceGroups;
