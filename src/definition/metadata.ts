export type MetadataRecordType = {
  id: number;
  metadata: Record<
    string,
    {
      version: string;
      send_local: boolean;
    }
  >;
};
