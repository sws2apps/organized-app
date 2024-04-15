import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AssignmentType from '../../classes/AssignmentType';

const useAssignmentType = ({ handleChangeType, person, assignable, currentType }) => {
  const { t } = useTranslation('ui');

  const [localList, setLocalList] = useState([]);
  const [isFemale, setIsFemale] = useState(false);
  const [value, setValue] = useState(null);

  const handleChange = (newVal) => {
    setValue(newVal);
    handleChangeType(newVal.value);
  };

  const getHeaderLabel = (value) => {
    if (value === 'mm') return t('midweekMeeting');
    if (value === 'tgw') return t('treasuresPart');
    if (value === 'ayf') return t('applyFieldMinistryPart');
    if (value === 'lc') return t('livingPart');

    return '';
  };

  useEffect(() => {
    setIsFemale(person.isFemale);
  }, [person.isFemale]);

  useEffect(() => {
    if (assignable) {
      let data = AssignmentType.local().filter((assType) => assType.assignable === true);

      if (isFemale) {
        data = data.filter((assType) => assType.maleOnly !== true);
      }

      setLocalList(data);
    } else {
      setLocalList(AssignmentType.local());
    }
  }, [assignable, isFemale]);

  useEffect(() => {
    const find = AssignmentType.local().find((assType) => assType.value === currentType);
    setValue(find);
  }, [currentType]);

  return { localList, handleChange, value, getHeaderLabel };
};

export default useAssignmentType;
