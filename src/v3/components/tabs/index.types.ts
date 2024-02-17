export type TabsPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

export type TabCustomProps = {
  label: string;
  Component: React.ReactNode;
}[];
