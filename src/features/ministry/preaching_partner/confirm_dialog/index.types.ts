export type PreachingPartnerConfirmDialogProps = {
  open: boolean;
  onClose: VoidFunction;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel: string;
};
