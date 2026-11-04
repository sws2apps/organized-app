export type RotationOrderProps = {
  groups: { value: string; label: string }[];
  rotation: string[];
  onChange: (rotation: string[]) => void;
};
