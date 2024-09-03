import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { selectedPublisherReportState } from '@states/field_service_reports';

const useFieldService = () => {
  const selectedPublisher = useRecoilValue(selectedPublisherReportState);

  const editorOpen = useMemo(() => {
    return selectedPublisher ? true : false;
  }, [selectedPublisher]);

  return { editorOpen };
};

export default useFieldService;
