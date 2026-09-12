import { ReactNode } from 'react';

export type IBAnnouncementCardProps = {
  title: string;
  date?: Date;
  counter?: number;
  pinned: boolean;
  onEdit?: VoidFunction;
  onDelete?: VoidFunction;
  onPin?: VoidFunction;
  content: ReactNode;
};
