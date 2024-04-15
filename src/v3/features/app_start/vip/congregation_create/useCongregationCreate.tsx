import { useState } from 'react';

const useCongregationCreate = () => {
  const [isCreate, setIsCreate] = useState(false);

  return { isCreate, setIsCreate };
};

export default useCongregationCreate;
