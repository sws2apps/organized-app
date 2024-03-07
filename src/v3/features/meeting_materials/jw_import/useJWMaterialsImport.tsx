import { useRecoilValue } from 'recoil';
import { isImportJWOrgState } from '@states/sources';
import { setIsImportJWOrg } from '@services/recoil/sources';
import { useEffect } from 'react';

const useJWMaterialsImport = () => {
  const isOpen = useRecoilValue(isImportJWOrgState);

  useEffect(() => {
    const handleRunImport = async () => {
      await setIsImportJWOrg(true);
    };

    handleRunImport();
  }, []);

  return { isOpen };
};

export default useJWMaterialsImport;
