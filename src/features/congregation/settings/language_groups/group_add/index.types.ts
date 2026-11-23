export type GroupAddProps = {
  open: boolean;
  onClose: VoidFunction;
  onSuccess?: (groupId: string) => void;
};

export type CreateState = 'start' | 'final';
