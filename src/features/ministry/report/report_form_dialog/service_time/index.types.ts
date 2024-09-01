export type ServiceTimeProps = {
  isEdit?: boolean;
  onClose: VoidFunction;
  date: string;
  minDate: Date;
  maxDate: Date;
  onDateChange: (value: Date) => void;
};
