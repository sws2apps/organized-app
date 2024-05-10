import Checkbox from '@mui/material/Checkbox';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormControlLabel from '@mui/material/FormControlLabel';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view';

const ExpandIcon = () => <ChevronRightIcon sx={{ fontSize: '30px !important' }} />;
const CollapseIcon = () => <ExpandMoreIcon sx={{ fontSize: '30px !important' }} />;

const TreeViewCheckbox = (props) => {
  const { data, selected, defaultExpanded } = props;

  const getChildById = (node, value) => {
    let array = [];

    const getAllChild = (nodes) => {
      if (nodes === null) return [];
      array.push(nodes.value);
      if (Array.isArray(nodes.children)) {
        nodes.children.forEach((node) => {
          array = [...array, ...getAllChild(node)];
          array = array.filter((v, i) => array.indexOf(v) === i);
        });
      }
      return array;
    };

    const getNodeById = (nodes, value) => {
      if (nodes.value === value) {
        return nodes;
      } else if (Array.isArray(nodes.children)) {
        let result = null;
        nodes.children.forEach((node) => {
          if (getNodeById(node, value)) {
            result = getNodeById(node, value);
          }
        });
        return result;
      }

      return null;
    };

    return getAllChild(getNodeById(node, value));
  };

  const getOnChange = (checked, nodes) => {
    const allNode = getChildById(data, nodes.value);

    let array = checked ? [...selected, ...allNode] : selected.filter((value) => !allNode.includes(value));

    array = array.filter((v, i) => array.indexOf(v) === i);

    props.setSelected(array);
  };

  const renderTree = (nodes) => {
    return (
      <TreeItem
        key={nodes.value}
        itemId={nodes.value}
        label={
          <FormControlLabel
            control={
              <Checkbox
                checked={selected.some((item) => item === nodes.value)}
                onChange={(event) => getOnChange(event.currentTarget.checked, nodes)}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  padding: '3px 5px 3px 3px',
                  marginLeft: '13px',
                }}
              />
            }
            label={<>{nodes.label}</>}
            key={nodes.value}
          />
        }
      >
        {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
      </TreeItem>
    );
  };

  return (
    <SimpleTreeView
      defaultExpandedItems={defaultExpanded}
      slots={{
        expandIcon: ExpandIcon,
        collapseIcon: CollapseIcon,
      }}
    >
      {renderTree(data)}
    </SimpleTreeView>
  );
};

export default TreeViewCheckbox;
