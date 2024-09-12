import { FC, Ref, forwardRef } from 'react';
import {
  RichTreeView,
  RichTreeViewProps,
  TreeItem2,
  TreeItem2Checkbox,
} from '@mui/x-tree-view';
import {
  UseTreeItem2CheckboxSlotOwnProps,
  UseTreeItem2Parameters,
} from '@mui/x-tree-view/useTreeItem2/useTreeItem2.types';
import {
  IconCheckboxEmpty,
  IconCheckboxFilled,
  IconCheckboxMultiple,
  IconCollapse,
  IconExpand,
} from '@components/icons';
import Typography from '@components/typography';

const TreeCheckbox = forwardRef(function TreeCheckbox(
  props: UseTreeItem2CheckboxSlotOwnProps,
  ref: Ref<HTMLInputElement>
) {
  return (
    <TreeItem2Checkbox
      ref={ref}
      {...props}
      onClick={(e) => e.stopPropagation()}
      sx={{ padding: 0 }}
      icon={<IconCheckboxEmpty color={'var(--accent-350)'} />}
      indeterminateIcon={<IconCheckboxMultiple color={'var(--accent-main)'} />}
      checkedIcon={<IconCheckboxFilled color={'var(--accent-main)'} />}
    />
  );
});

const TreeItem = forwardRef(function TreeItem(
  props: UseTreeItem2Parameters,
  ref: Ref<HTMLLIElement>
) {
  return (
    <TreeItem2
      ref={ref}
      {...props}
      slots={{
        checkbox: TreeCheckbox,
        collapseIcon: IconCollapse,
        expandIcon: IconExpand,
        label: Typography,
      }}
      slotProps={{
        label: {
          className: props.children ? 'h4' : 'body-regular',
          style: { marginRight: '12px' },
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
      }}
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
        ...props.sx,
      }}
      multiSelect
      checkboxSelection
      slots={{ item: TreeItem }}
    />
  );
};

export default RichTreeViewCheckboxes;
