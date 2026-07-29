import { ExternalLinkType } from '@definition/information_board';

export type EditExternalLinkButtonProps = ExternalLinkType & {
  index: number;
  showDivider: boolean;
  onDelete: (id: string) => void;
  onChange: (id: string, changes: Partial<ExternalLinkType>) => void;
};
