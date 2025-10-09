const useConvertValue = () => {
  const convertValue = (value: string, targetType: string) => {
    if (value === '' || value === null) return null;

    if (targetType === 'boolean')
      return ['yes', 'true', '1'].includes(value.toLowerCase());

    if (targetType === 'number') {
      const num = Number(value);
      return Number.isNaN(num) ? null : num;
    }

    if (targetType === 'object') {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }

    if (targetType === 'gender') {
      return ['male'].includes(value.toLowerCase()) ? 'male' : 'female';
    }

    if (targetType === 'date') {
      const parsedDate = new Date(value);
      return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    return value;
  };

  return { convertValue };
};

export default useConvertValue;
