import { FC, forwardRef, Ref } from 'react';
import {
  RichTreeView,
  RichTreeViewProps,
  TreeItem,
  TreeItemProps,
  TreeItemSlotProps,
} from '@mui/x-tree-view';
import {
  IconCheckboxEmpty,
  IconCheckboxFilled,
  IconCheckboxMultiple,
  IconCollapse,
  IconExpand,
} from '@components/icons';

const CustomTreeItem = forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: Ref<HTMLLIElement>
) {
  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{
        collapseIcon: IconCollapse,
        expandIcon: IconExpand,
      }}
      slotProps={
        {
          checkbox: {
            size: 'small',
            icon: <IconCheckboxEmpty color={'var(--accent-350)'} />,
            checkedIcon: <IconCheckboxFilled color={'var(--accent-main)'} />,
            indeterminateIcon: (
              <IconCheckboxMultiple color={'var(--accent-main)'} />
            ),
          },
          label: {
            className:
              (props.children as unknown as []).length > 0
                ? 'h4'
                : 'body-regular',
            style: { marginRight: '12px', color: 'var(--black)' },
          },
          collapseIcon: { color: 'var(--black)' },
          expandIcon: { color: 'var(--black)' },
          content: {
            style: {
              position: 'relative',
              padding: '8px',
              backgroundColor: 'unset',
            },
          },
          iconContainer: { style: { position: 'absolute', right: '5px' } },
        } as TreeItemSlotProps
      }
    />
  );
});

const RichTreeViewCheckboxes: FC<RichTreeViewProps<unknown, true>> = (
  props
) => {
  return (
    <RichTreeView
      itemChildrenIndentation="16px"
      {...props}
      sx={{
        maxHeight: '290px',
        overflow: 'auto',
        '& li': { borderBottom: '1px solid var(--accent-200)' },
        '& li:last-child': { borderBottom: 'none' },
        '& li > div': { '&:hover': { backgroundColor: 'unset' } },
        '& .MuiCollapse-root': { marginLeft: '12px' },
        ...props.sx,
      }}
      multiSelect
      checkboxSelection
      selectionPropagation={{ descendants: true, parents: true }}
      slots={{ item: CustomTreeItem }}
    />
  );
};

export default RichTreeViewCheckboxes;
