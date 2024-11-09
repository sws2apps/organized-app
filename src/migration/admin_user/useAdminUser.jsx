import { useEffect, useState } from 'react';
import appDb from '../db';

const useAdminUser = () => {
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const checkData = async () => {
      const persons = await appDb.persons.toArray();

      setHasData(persons.length > 0);
    };

    checkData();
  }, []);

  return { hasData };
};

export default useAdminUser;
