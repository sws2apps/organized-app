import { useLayoutEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import { useBreakpoints } from '@hooks/index';
import { selectedPublisherReportState } from '@states/field_service_reports';
import { personsState } from '@states/persons';
import usePerson from '@features/persons/hooks/usePerson';

const useFieldService = () => {
  const navigate = useNavigate();

  const { desktopUp } = useBreakpoints();

  const { getName } = usePerson();

  const [selectedPublisher, setSelectedPublisher] = useAtom(
    selectedPublisherReportState
  );

  const persons = useAtomValue(personsState);

  const listScrollPosition = useRef(0);
  const prevEditorOpen = useRef(false);

  const editorOpen = useMemo(() => {
    return selectedPublisher ? true : false;
  }, [selectedPublisher]);

  const selectedPersonName = useMemo(() => {
    const person = persons.find(
      (record) => record.person_uid === selectedPublisher
    );

    return person ? getName(person) : '';
  }, [persons, selectedPublisher, getName]);

  // on mobile the list and the person report swap in place: opening a report
  // starts it at the top of the page, going back restores the list scroll
  useLayoutEffect(() => {
    if (prevEditorOpen.current === editorOpen) return;

    prevEditorOpen.current = editorOpen;

    if (desktopUp) return;

    if (editorOpen) {
      listScrollPosition.current = window.scrollY;
      window.scrollTo({ top: 0 });
    } else {
      window.scrollTo({ top: listScrollPosition.current });
    }
  }, [editorOpen, desktopUp]);

  const handleOpenBranchReport = () => {
    navigate('/reports/branch-office');
  };

  const handleBack = () => setSelectedPublisher(undefined);

  return {
    editorOpen,
    handleOpenBranchReport,
    selectedPersonName,
    handleBack,
  };
};

export default useFieldService;
