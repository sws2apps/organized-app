import {
  PublicWitnessingLocationType,
  PublicWitnessingShiftType,
} from '@definition/public_witnessing';

export type ScheduleMode = 'every_day' | 'custom';

// Shifts get an id while they are being edited so the rows keep their identity
// as the times change; it is dropped again on save.
export type EditableShiftType = PublicWitnessingShiftType & { id: string };

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

export type ShiftRowProps = {
  shift: EditableShiftType;
  hour24: boolean;
  startLabel: string;
  endLabel: string;
  onChange: (field: keyof PublicWitnessingShiftType, value: string) => void;
  onRemove: VoidFunction;
};

export type ScheduleEditorProps = {
  scheduleMode: ScheduleMode;
  onModeChange: (mode: ScheduleMode) => void;
  /**
   * Weekdays the location is worked on — 1 (Monday) to 7 (Sunday).
   */
  approvedDays: number[];
  /**
   * The weekday whose shifts are being edited, or null when none is open.
   */
  selectedDay: number | null;
  selectedShifts: EditableShiftType[];
  onToggleDay: (weekday: number) => void;
  onSelectDay: (weekday: number | null) => void;
  onAddShift: VoidFunction;
  onRemoveShift: (index: number) => void;
  onShiftChange: (
    index: number,
    field: keyof PublicWitnessingShiftType,
    value: string
  ) => void;
};
