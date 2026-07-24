import { PublicWitnessingLocationType } from '@definition/public_witnessing';

export type LocationFormProps = {
  open: boolean;
  onClose: VoidFunction;
  /**
   * The location being edited, or null to create a new one.
   */
  location: PublicWitnessingLocationType | null;

  /**
   * Opens the delete confirmation (edit mode only).
   */
  onDelete?: VoidFunction;
};
