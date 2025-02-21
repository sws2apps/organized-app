import { useMemo } from 'react';
import { LANGUAGE_LIST } from '@constants/index';
import { SelectPropsType } from '@components/select/index.types';

const useSourceLanguageSelector = ({ value }: SelectPropsType) => {
  const SOURCE_LANGUAGES = useMemo(() => {
    return LANGUAGE_LIST.filter((record) => record.source);
  }, []);

  const value_fullname = useMemo(() => {
    return (
      SOURCE_LANGUAGES.find((record) => record.code.toUpperCase() === value)
        ?.name || ''
    );
  }, [value, SOURCE_LANGUAGES]);

  return { SOURCE_LANGUAGES, value_fullname };
};

export default useSourceLanguageSelector;
