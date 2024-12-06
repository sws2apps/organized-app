import { useMemo, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { TreeViewBaseItem } from '@mui/x-tree-view';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { currentReportMonth } from '@utils/date';
import { useAppTranslation } from '@hooks/index';
import { fullnameOptionState } from '@states/settings';
import { buildPersonFullname } from '@utils/common';
import { ActivePublishersProps } from './index.types';
import usePersons from '@features/persons/hooks/usePersons';
import useParentUncheckHandler from '../useParentUncheckHandler';

const useActivePublishers = ({ onExport }: ActivePublishersProps) => {
  const { t } = useAppTranslation();

  const { getFTSMonths, getAPMonths, getPublisherMonths } = usePersons();

  const toggledItemRef = useRef<{ [itemId: string]: boolean }>({});

  const apiRef = useTreeViewApiRef();

  const fullnameOption = useRecoilValue(fullnameOptionState);

  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const month = useMemo(() => {
    return currentReportMonth();
  }, []);

  const person_FTS = useMemo(() => {
    return getFTSMonths(month);
  }, [getFTSMonths, month]);

  const person_AP = useMemo(() => {
    return getAPMonths(month);
  }, [getAPMonths, month]);

  const person_publishers = useMemo(() => {
    return getPublisherMonths(month);
  }, [getPublisherMonths, month]);

  const groups = useMemo(() => {
    const result: TreeViewBaseItem[] = [];

    if (person_FTS.length > 0) {
      result.push({
        id: 'FTS',
        label: t('tr_fulltimeServants'),
        children: person_FTS
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

    if (person_AP.length > 0) {
      result.push({
        id: 'AP',
        label: t('tr_APs'),
        children: person_AP.map((person) => {
          return {
            id: person.person_uid,
            label: buildPersonFullname(
              person.person_data.person_lastname.value,
              person.person_data.person_firstname.value,
              fullnameOption
            ),
          };
        }),
      });
    }

    if (person_publishers.length > 0) {
      result.push({
        id: 'publishers',
        label: t('tr_activePublishersAll'),
        children: person_publishers.map((person) => {
          return {
            id: person.person_uid,
            label: buildPersonFullname(
              person.person_data.person_lastname.value,
              person.person_data.person_firstname.value,
              fullnameOption
            ),
          };
        }),
      });
    }

    return result;
  }, [person_FTS, person_AP, t, fullnameOption, person_publishers, search]);

  const btnLabel = useMemo(() => {
    let label = t('tr_export');
    if (selected.length === 0) return label;

    const cn = selected.filter(
      (record) => record !== 'FTS' && record !== 'AP' && record !== 'publishers'
    );

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
    await onExport(selected, 'active');
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

export default useActivePublishers;
