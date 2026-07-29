import { ExternalLinkType } from '@definition/information_board';
import { InfoBoardGeneralInformationDraftProps } from '../index.types';

const useInfoBoardQSExternalLinks = (
  props: InfoBoardGeneralInformationDraftProps
) => {
  const handleAddExternalLink = () => {
    props.changeDraft((prev) => {
      if (!prev) return prev;

      const draft = structuredClone(prev);

      draft.external_links ??= [];

      draft.external_links.push({
        id: crypto.randomUUID(),
        label: '',
        link: '',
        _deleted: false,
        updatedAt: new Date().toISOString(),
      });

      return draft;
    });
  };

  const handleDeleteExternalLink = (id: string) => {
    props.changeDraft((prev) => {
      if (!prev) return prev;

      const draft = structuredClone(prev);

      const link = draft.external_links?.find((item) => item.id === id);

      if (!link) return prev;

      link._deleted = true;
      link.updatedAt = new Date().toISOString();

      return draft;
    });
  };

  const handleUpdateExternalLink = (
    id: string,
    changes: Partial<ExternalLinkType>
  ) => {
    props.changeDraft((prev) => {
      if (!prev) return prev;

      const draft = structuredClone(prev);

      const link = draft.external_links?.find((item) => item.id === id);

      if (!link) return prev;

      Object.assign(link, changes);

      link.updatedAt = new Date().toISOString();

      return draft;
    });
  };

  return {
    externalLinks: props.draft?.external_links,
    handleAddExternalLink,
    handleDeleteExternalLink,
    handleUpdateExternalLink,
  };
};

export default useInfoBoardQSExternalLinks;
