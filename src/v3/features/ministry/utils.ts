/**
 * Converts a duration string in the format 'HH:MM' to seconds.
 * @param {string} duration - The duration string to convert.
 * @returns {number} The duration in seconds.
 */
export const convertDurationStringToSeconds = (duration: string): number => {
  const [hours, minutes] = duration.split(':');
  return parseInt(hours) * 3600 + parseInt(minutes) * 60;
};

/**
 * Converts a duration in seconds to a string format 'HH:MM'.
 * @param {number} seconds - The duration in seconds to convert.
 * @returns {string} The duration string in 'HH:MM' format.
 */
export const convertDurationInSecondsToString = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0 && minutes === 0) {
    return '00:00';
  }

  const formattedHours = hours < 10 ? '0' + hours.toString() : hours.toString();
  const formattedMinutes = minutes < 10 ? '0' + minutes.toString() : minutes.toString();

  return `${formattedHours}:${formattedMinutes}`;
};
