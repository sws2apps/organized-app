import { TreeViewBaseItem } from '@mui/x-tree-view';

const useParentUncheckHandler = () => {
  const findParentIdByItem = (
    dataSource: TreeViewBaseItem[],
    itemId: string,
    parentId: string = null
  ) => {
    for (const item of dataSource) {
      if (item.id === itemId) {
        return parentId;
      }
      if (item.children) {
        const found = findParentIdByItem(item.children, itemId, item.id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const deleteSelectionFromParentItem = (
    oldSelectedList: string[],
    groups: TreeViewBaseItem[],
    selected: string[]
  ) => {
    const missedItem = selected.filter(
      (item) => !oldSelectedList.includes(item)
    )[0];

    if (!missedItem) {
      return oldSelectedList;
    }

    const missedItemParent = findParentIdByItem(groups, missedItem);

    return oldSelectedList.filter((item) => item !== missedItemParent);
  };

  return {
    deleteSelectionFromParentItem,
  };
};

export default useParentUncheckHandler;
