/**
 * Represents a card in the slider, used to showcase updates or new features.
 * Each card provides visual and textual information about a specific update.
 */
export type SliderCard = {
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
};
