export type BackupOrganizedType = {
  name: string;
  exported: string;
  version: string;
  data: {
    [table: string]: object;
  };
};
