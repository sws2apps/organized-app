import { useState } from 'react';
import { GroupDetailsProps } from './index.types';

const useGroupDetails = ({
  group,
  onChange,
  language: incomingLanguage,
  onLanguageChange,
}: GroupDetailsProps) => {
  const [name, setName] = useState(group.group_data.name);
  const [language, setLanguage] = useState(incomingLanguage);

  const handleNameChange = (value: string) => {
    setName(value);

    const newGroup = structuredClone(group);
    newGroup.group_data.name = value;
    onChange(newGroup);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    onLanguageChange(value);
  };

  return {
    name,
    handleNameChange,
    language,
    handleLanguageChange,
  };
};

export default useGroupDetails;
