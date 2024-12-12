export const formatTimeUnit = (value: number) => {
  return value.toString().padStart(2, '0');
};

export const getNextValue = (current: number, max: number) => {
  return formatTimeUnit((current + 1) % max);
};

export const getPrevValue = (current: number, max: number) => {
  return formatTimeUnit((current - 1 + max) % max);
};

export const validateHours = (hours: number | string) => {
  const numHours = typeof hours === 'string' ? parseInt(hours, 10) : hours;

  if (isNaN(numHours) || numHours < 0 || numHours >= 24) {
    return '00';
  }

  return formatTimeUnit(numHours);
};

export const validateMinutes = (minutes: number | string) => {
  const numMinutes =
    typeof minutes === 'string' ? parseInt(minutes, 10) : minutes;

  if (isNaN(numMinutes) || numMinutes < 0 || numMinutes >= 60) {
    return '00';
  }

  return formatTimeUnit(numMinutes);
};
