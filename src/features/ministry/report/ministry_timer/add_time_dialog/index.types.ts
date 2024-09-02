export type AddTimeDialogProps = {
  open: boolean;
  onClose: VoidFunction;
  onAdd?: (time: number) => void;
};
