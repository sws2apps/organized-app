export type MonthItemProps = {
  data: {
    month: string;
    checked: boolean;
    published?: boolean;
  };
  onChange: (checked: boolean, value: string) => void;
};
