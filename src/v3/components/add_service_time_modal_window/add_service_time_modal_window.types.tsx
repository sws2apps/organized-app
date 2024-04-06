export type AddServieTimeModalWindowProps = {
  duration: number;
  variant?: 'simple' | 'pioneer';
  showCreditHours?: boolean;
  bibleStudiesList: string[];
  cancelButtonClick?: VoidFunction;
  addButtonClick?: VoidFunction;
  open: boolean;
};
