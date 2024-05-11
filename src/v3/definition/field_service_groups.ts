type FieldServiceGroupMembersType = {
  /**
   * Null or date in ISO string format to indicate if the person is deleted
   */
  _deleted: string | null;

  /**
   * The person UID record to include in the field service group
   */
  person_uid: string;

  /**
   * Value used for sorting the person in the members list
   */
  sort_index: {
    /**
     * Number value of the sort
     */
    value: number;

    /**
     * Date in ISO string format to record when the sort index was last updated
     */
    updatedAt: string;
  };

  /**
   * To indicate if the person is the overseer of the field service group
   */
  isOverseer: {
    /**
     * Boolean to indicate if person is overseer
     */
    value: boolean;

    /**
     * Date in ISO string format to record when the value was last updated
     */
    updatedAt: string;
  };

  /**
   * To indicate if the person is the assistant of the field service group
   */
  isAssistant: {
    /**
     * Boolean to indicate if person is assistant
     */
    value: boolean;

    /**
     * Date in ISO string format to record when the value was last updated
     */
    updatedAt: string;
  };
};

export type FieldServiceGroupType = {
  /**
   * Auto-generated ID by IndexedDb for the record.
   */
  id?: number;

  /**
   * Null or date in ISO string format to indicate if the field service group is deleted
   */
  _deleted: string | null;

  /**
   * Custom name of the field service group
   */
  name: {
    /**
     * Name of the field service group
     */
    value: string;

    /**
     * Date in ISO string format to record when the name was last updated
     */
    updatedAt: string;
  };

  /**
   * Value used for sorting the field service groups records
   */
  sort_index: {
    /**
     * Number value of the sort
     */
    value: number;

    /**
     * Date in ISO string format to record when the sort index was last updated
     */
    updatedAt: string;
  };

  /**
   * List of publishers in the field service groups
   */
  members: FieldServiceGroupMembersType[];
};
