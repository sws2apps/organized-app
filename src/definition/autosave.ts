export type AutosaveDraft = {
  value: string;
  revision: string;
  status: 'pending' | 'saving' | 'saved' | 'failed';
};
