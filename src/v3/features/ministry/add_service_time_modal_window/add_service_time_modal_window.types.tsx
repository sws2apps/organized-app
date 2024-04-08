/**
 * Represents the result of calculations performed by the Add Service Time Modal Window component.
 */
export type ASTMWResult = {
  /**
   * The total duration of service hours in seconds.
   */
  hoursInSeconds: number;

  /**
   * The total duration of credit hours in seconds.
   */
  creditHoursInSeconds: number;

  /**
   * The number of Bible studies associated with the service time.
   */
  bibleStudiesCount: number;

  /**
   * An array of Bible study names associated with the service time.
   */
  bibleStudies: string[];

  /**
   * The date of the service time.
   */
  date: Date;
};

/**
 * Represents the props that can be passed to the Add Service Time Modal Window component.
 */
export type AddServiceTimeModalWindowProps = {
  /**
   * The duration of the service time in minutes.
   */
  duration: number;

  /**
   * Specifies the variant of the modal window.
   * - 'simple': Indicates a simple variant.
   * - 'pioneer': Indicates a pioneer variant.
   */
  variant?: 'simple' | 'pioneer';

  /**
   * Specifies whether to show credit hours in the modal window.
   */
  showCreditHours?: boolean;

  /**
   * An array of Bible studies list.
   */
  bibleStudiesList: string[];

  /**
   * Callback function invoked when the cancel button is clicked.
   */
  cancelButtonClick?: () => void;

  /**
   * Callback function invoked when the add button is clicked.
   */
  addButtonClick?: () => void;

  /**
   * Specifies whether the modal window is open or closed.
   */
  open: boolean;

  /**
   * Reference to the component.
   */
  reference?: React.Ref<unknown>;

  /**
   * Callback function invoked when the result of the modal window is available.
   * It receives an object containing the calculated result.
   */
  result?: (result: ASTMWResult) => void;
};
