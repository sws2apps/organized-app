import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { selectedPublisherReportState } from '@states/field_service_reports';

const useFieldService = () => {
  const navigate = useNavigate();

  const selectedPublisher = useRecoilValue(selectedPublisherReportState);

  const editorOpen = useMemo(() => {
    return selectedPublisher ? true : false;
  }, [selectedPublisher]);

  const handleOpenBranchReport = () => {
    navigate('/reports/branch-office');
  };

  return { editorOpen, handleOpenBranchReport };
};

export default useFieldService;
