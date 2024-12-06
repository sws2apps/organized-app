import { TreeViewBaseItem } from '@mui/x-tree-view';

const useParentUncheckHandler = (
  groups: TreeViewBaseItem[],
  selected: string[]
) => {
  const findParentIdByItem = (
    dataSource,
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

  const deleteSelectionFromParentItem = (oldSelectedList: string[]) => {
    const missedItem = selected.filter(
      (item) => !oldSelectedList.includes(item)
    )[0];

    const missedItemParent = findParentIdByItem(groups, missedItem);

    return oldSelectedList.filter((item) => item !== missedItemParent);
  };

  return {
    deleteSelectionFromParentItem,
  };
};

export default useParentUncheckHandler;
