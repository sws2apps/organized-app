export type TransferMinutesVariant = 'transfer' | 'keep';

export type TransferMinutesPopUpProps = {
  transferButtonClick?: VoidFunction;
  keepButtonClick?: VoidFunction;
  extraMinutes: number;
};
