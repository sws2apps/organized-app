export type CustomDropdownContainerProps = {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  label: string;
};

export type CustomDropdownMenuProps = {
  items: string[];
  labelAdd: string;
  checkedItems: (value: string[]) => void;
  anchorElement: HTMLElement;
  open: boolean;
  width: string;
  editIconClicked: (item_index: number, item_text: string) => void;
};
