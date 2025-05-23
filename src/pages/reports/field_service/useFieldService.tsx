import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useAtomValue } from 'jotai';
import { selectedPublisherReportState } from '@states/field_service_reports';

const useFieldService = () => {
  const navigate = useNavigate();

  const selectedPublisher = useAtomValue(selectedPublisherReportState);

  const editorOpen = useMemo(() => {
    return selectedPublisher ? true : false;
  }, [selectedPublisher]);

  const handleOpenBranchReport = () => {
    navigate('/reports/branch-office');
  };

  return { editorOpen, handleOpenBranchReport };
};

export default useFieldService;
