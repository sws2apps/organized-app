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
  const formattedMinutes =
    minutes < 10 ? '0' + minutes.toString() : minutes.toString();

  return `${formattedHours}:${formattedMinutes}`;
};

/**
 * Converts a duration in seconds to an object containing hours and minutes.
 * @param seconds - The duration in seconds to convert.
 * @returns An object containing the hours and minutes.
 */
export const convertDurationInSecondsToHoursAndMinutes = (
  seconds: number
): { hours: number; minutes: number } => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return { hours, minutes };
};

/**
 * Converts an object containing hours and minutes to a duration in seconds.
 *
 * @param time - An object containing the hours and minutes to convert.
 * @param time.hours - The number of hours.
 * @param time.minutes - The number of minutes.
 * @returns The total duration in seconds.
 */
export const convertHoursAndMinutesToDurationInSeconds = (time: {
  hours: number;
  minutes: number;
}): number => {
  const { hours, minutes } = time;
  const totalSeconds = hours * 3600 + minutes * 60;

  return totalSeconds;
};

export const getRemainingMinutesInSeconds = (seconds: number): number => {
  const totalMinutes = Math.floor(seconds / 60);
  const remainingMinutes = totalMinutes % 60;

  const remainingMinutesInSeconds = remainingMinutes * 60;
  return remainingMinutesInSeconds;
};
