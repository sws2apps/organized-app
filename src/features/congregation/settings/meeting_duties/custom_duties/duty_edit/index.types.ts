export type DutyEditProps = {
  open: boolean;
  onClose: VoidFunction;
  onDelete?: VoidFunction;
  type: 'add' | 'edit';
  id?: string;
};
