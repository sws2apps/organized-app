import { useState } from 'react';
import useBreakpoints from '@hooks/useBreakpoints';

const useMinistryPreferences = () => {
  const { laptopUp } = useBreakpoints();

  const [addCredits, setAddCredits] = useState(false);

  const handleAddCreditsChange = async (value) => {
    setAddCredits(value);
  };

  return { addCredits, handleAddCreditsChange, laptopUp };
};

export default useMinistryPreferences;
