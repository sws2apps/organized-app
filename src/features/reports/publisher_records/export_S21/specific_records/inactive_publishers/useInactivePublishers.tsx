import { useMemo, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { TreeViewBaseItem } from '@mui/x-tree-view';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { currentReportMonth } from '@utils/date';
import { useAppTranslation } from '@hooks/index';
import { fullnameOptionState } from '@states/settings';
import { buildPersonFullname } from '@utils/common';
import { InactivePublishersProps } from './index.types';
import usePersons from '@features/persons/hooks/usePersons';
import useParentUncheckHandler from '../useParentUncheckHandler';

const useInactivePublishers = ({ onExport }: InactivePublishersProps) => {
  const { t } = useAppTranslation();

  const { getPublishersInactive } = usePersons();
  const { deleteSelectionFromParentItem } = useParentUncheckHandler();

  const toggledItemRef = useRef<{ [itemId: string]: boolean }>({});

  const apiRef = useTreeViewApiRef();

  const fullnameOption = useRecoilValue(fullnameOptionState);

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
      newSelectedItemsWithChildren,
      groups,
      selected
    );

    setSelected(selectedItemsWithoutParent);

    toggledItemRef.current = {};
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
    apiRef,
    handleItemSelectionToggle,
    btnLabel,
    handleSearchChange,
    search,
    isProcessing,
    handleExport,
  };
};

export default useInactivePublishers;
