/**
 * Props for the SearchBar component.
 */
export type SearchBarProps = {
  /**
   * Callback function invoked when the search button is clicked or the Enter key is pressed.
   *
   * @param query The search query entered by the user.
   */
  onSearch?: (query: string) => void;

  /**
   * Placeholder text displayed in the search input field.
   */
  placeholder: string;

  /**
   * The current value of the search input field.
   */
  value?: string;
};
