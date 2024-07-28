import React, { useEffect, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CustomDivider from '@components/divider';
import { IconDragHandle, IconRemovePerson } from '@components/icons';
import CustomTypography from '@components/typography';
import { Box } from '@mui/material';
import {
  CustomDragListItemProps,
  CustomDragListProps,
} from './drag_list.types';

const ItemTypes = {
  LIST_ITEM: 'listItem',
};

type DragItem = {
  index: number;
  id: string;
  type: string;
};

const CustomDragList = (props: CustomDragListProps) => {
  const [valuesTexts, setValuesTexts] = useState<string[]>(() => {
    return props.values;
  });

  const variant = props.variant;

  useEffect(() => {
    props.onChange(valuesTexts);
  }, [props, valuesTexts]);

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const items = Array.from(valuesTexts);
    const [movedItem] = items.splice(dragIndex, 1);
    items.splice(hoverIndex, 0, movedItem);
    setValuesTexts(items);
  };

  const CustomDragListItem = (itemProps: CustomDragListItemProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const [, drop] = useDrop({
      accept: ItemTypes.LIST_ITEM,
      hover(item: DragItem) {
        if (!ref.current) {
          return;
        }
        const dragIndex = item.index;
        const hoverIndex = itemProps.index;

        if (dragIndex === hoverIndex) {
          return;
        }

        moveItem(dragIndex, hoverIndex);

        item.index = hoverIndex;
      },
    });

    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.LIST_ITEM,
      item: {
        type: ItemTypes.LIST_ITEM,
        id: itemProps.value,
        index: itemProps.index,
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    drag(drop(ref));

    return (
      <Box
        ref={ref}
        sx={{
          opacity: isDragging ? 0.5 : 1,
          padding: '8px',
          gap: '8px',
          display: 'flex',
          borderRadius: '12px',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--white)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <IconDragHandle color="var(--accent-main)" />
          {variant == 'reorder' ? (
            <div dangerouslySetInnerHTML={{ __html: itemProps.value }} />
          ) : (
            <CustomTypography className="body-regular">
              {itemProps.value}
            </CustomTypography>
          )}
        </Box>
        {variant == 'publishers' ? (
          <Box height={24} onClick={itemProps.onDeleteButtonClick}>
            <IconRemovePerson color="var(--red-main)" />
          </Box>
        ) : null}
      </Box>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box>
        {valuesTexts.map((text, index) => (
          <React.Fragment key={text}>
            <CustomDragListItem
              value={text}
              index={index}
              onDeleteButtonClick={() =>
                setValuesTexts(valuesTexts.filter((_, i) => i !== index))
              }
            />
            <CustomDivider color="var(--accent-200)" />
          </React.Fragment>
        ))}
      </Box>
    </DndProvider>
  );
};

export default CustomDragList;
