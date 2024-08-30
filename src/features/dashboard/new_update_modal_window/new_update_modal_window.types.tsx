import { MouseEventHandler } from 'react';

/**
 * Represents a card in the slider, used to showcase updates or new features.
 * Each card provides visual and textual information about a specific update.
 */
export type NewUpdateSliderCard = {
  /**
   * The source URL of the image displayed on the card.
   * This image visually represents the update or feature highlighted on the card.
   */
  imageSrc: string;

  /**
   * The title of the update or feature displayed on the card.
   * This title gives a concise summary of the update or feature.
   */
  title: string;

  /**
   * A brief description of the update or feature.
   * This description provides additional details to help users understand the significance of the update.
   */
  description: string;

  /**
   * An optional background color for the card.
   * If provided, this color will be used as the card's background, helping to differentiate it visually.
   */
  backgroundColor?: string;

  /**
   * An optional color for the title text.
   * If provided, this color will be applied to the title, allowing for customization to match the card's design.
   */
  titleColor?: string;

  /**
   * An optional color for the description text.
   * If provided, this color will be applied to the description, ensuring readability and design consistency.
   */
  descriptionColor?: string;
};

/**
 * Props for the `NewUpdateModalWindow` component, which displays a modal window containing update details.
 */
export type NewUpdateModalWindowProps = {
  /**
   * An optional array of slider cards, where each card represents an update or new feature.
   * These cards provide visual information about the updates.
   */
  sliderCards?: NewUpdateSliderCard[];

  /**
   * An optional array of strings, each describing an improvement made in the update.
   * These descriptions provide additional context to users about what's new or enhanced.
   */
  improvements?: string[];

  /**
   * A boolean that determines whether the modal window is currently open.
   * Set this to `true` to display the modal, or `false` to hide it.
   */
  isOpen: boolean;

  /**
   * An optional event handler that triggers when the close button is clicked.
   * This handler allows you to define custom behavior when the user closes the modal.
   */
  onCloseButtonClick: VoidFunction;

  /**
   * An optional event handler that triggers when the Ok button is clicked.
   * This handler allows you to define custom behavior for navigating to the Ok update or screen.
   */
  onOkButtonClick: MouseEventHandler<HTMLAnchorElement>;
};
