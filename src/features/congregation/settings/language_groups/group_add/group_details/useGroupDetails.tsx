import { useState } from 'react';
import { GroupDetailsProps } from './index.types';

const useGroupDetails = ({ group, onChange }: GroupDetailsProps) => {
  const [name, setName] = useState(group.name);
  const [language, setLanguage] = useState(group.language);

  const handleNameChange = (value: string) => {
    setName(value);

    const newGroup = structuredClone(group);
    newGroup.name = value;
    onChange(newGroup);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);

    const newGroup = structuredClone(group);
    newGroup.language = value;
    onChange(newGroup);
  };

  return {
    name,
    handleNameChange,
    language,
    handleLanguageChange,
  };
};

export default useGroupDetails;
