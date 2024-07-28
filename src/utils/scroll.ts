/**
 * Disables window scrolling by capturing the current scroll position
 * and preventing any scroll events from changing it.
 */
export const disableWindowScroll = () => {
  // Capture the current scroll position
  const x: number = window.scrollX;
  const y: number = window.scrollY;

  // Override the window's onscroll event to lock the scroll position
  window.onscroll = () => {
    window.scrollTo(x, y);
  };
};

/**
 * Enables window scrolling by resetting the onscroll event handler.
 */
export const enableWindowScroll = () => {
  // Reset the window's onscroll event handler to allow scrolling
  window.onscroll = null;
};
