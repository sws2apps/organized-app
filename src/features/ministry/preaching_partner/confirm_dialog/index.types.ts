export type PreachingPartnerConfirmDialogProps = {
  open: boolean;
  onClose: VoidFunction;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  confirmLabel: string;
};
