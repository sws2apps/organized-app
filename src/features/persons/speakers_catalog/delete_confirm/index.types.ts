export type DeleteConfirmType = {
  open: boolean;
  title: string;
  description: string;
  onCancel: VoidFunction;
  onConfirm: VoidFunction;
};
