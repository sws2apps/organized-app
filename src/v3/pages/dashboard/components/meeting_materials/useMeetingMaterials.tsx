import { useInternetChecker } from '@hooks/index';
import { setIsImportJWOrg } from '@services/recoil/sources';

const useMeetingMaterials = () => {
  const { isNavigatorOnline } = useInternetChecker();

  const handleOpenJWImport = async () => {
    await setIsImportJWOrg(true);
  };

  return { handleOpenJWImport, isNavigatorOnline };
};

export default useMeetingMaterials;
