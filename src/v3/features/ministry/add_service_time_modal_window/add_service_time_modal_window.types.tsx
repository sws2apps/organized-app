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
};
