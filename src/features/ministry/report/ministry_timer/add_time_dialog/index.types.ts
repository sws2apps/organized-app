export type AddTimeDialogProps = {
  time: number;
  open: boolean;
  onClose: VoidFunction;
  onAdd?: (time: number) => void;
};
