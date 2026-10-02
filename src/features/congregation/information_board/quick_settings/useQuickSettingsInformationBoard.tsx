import { useAppTranslation } from '@hooks/index';
import { useEffect, useMemo, useRef, useState } from 'react';
import InfoBoardQSSmartWidgets from './smart_widgets';
import InfoBoardQSExternalLinks from './external_links';
import { useAtomValue } from 'jotai';
import {
  infoBoardGeneralInformationState,
  informationBoardState,
} from '@states/information_board';
import { InfoBoardGeneralInformationType } from '@definition/information_board';
import { dbInformationBoardSave } from '@services/dexie/information_board';
import { userDataViewState } from '@states/settings';
import { labelIsCorrect, linkIsCorrect } from './index.utils';

const useQuickSettingsInformationBoard = (
  settingsIsOpen: boolean,
  closeSettings: VoidFunction
) => {
  const { t } = useAppTranslation();

  const informationBoard = useAtomValue(informationBoardState);
  const infoBoardGeneralInformation = useAtomValue(
    infoBoardGeneralInformationState
  );

  const dataView = useAtomValue(userDataViewState);

  const [draft, setDraft] = useState<InfoBoardGeneralInformationType | null>(
    null
  );

  const saveButtonIsActive = useMemo(() => {
    return (
      draft?.external_links?.every(
        (extLink) =>
          labelIsCorrect(extLink.label) && linkIsCorrect(extLink.link)
      ) ?? true
    );
  }, [draft?.external_links]);

  const [activeTab, setActiveTab] = useState(0);

  const tabs = useMemo(() => {
    return [
      {
        label: t('tr_smartWidgets'),
        Component: (
          <InfoBoardQSSmartWidgets draft={draft} changeDraft={setDraft} />
        ),
      },
      {
        label: t('tr_externalLinks'),
        Component: (
          <InfoBoardQSExternalLinks draft={draft} changeDraft={setDraft} />
        ),
      },
    ];
  }, [draft, t]);

  const handleSave = async () => {
    if (!draft) return;

    const updatedInformationBoard = structuredClone(informationBoard);

    const index =
      updatedInformationBoard.information.general_information.findIndex(
        (item) => item.type === dataView
      );

    if (index === -1) return;

    updatedInformationBoard.information.general_information[index] = {
      ...draft,
      external_links: draft.external_links?.filter(({ link }) => link.trim()),
    };

    await dbInformationBoardSave(updatedInformationBoard);
    closeSettings();
  };

  const handleCancel = () => {
    setDraft(null);
    closeSettings();
  };

  const initialized = useRef(false);

  useEffect(() => {
    if (!settingsIsOpen) {
      initialized.current = false;
      return;
    }

    if (initialized.current) {
      return;
    }

    initialized.current = true;
    setDraft(structuredClone(infoBoardGeneralInformation));
  }, [settingsIsOpen, infoBoardGeneralInformation]);

  const handleTabChange = (tab: number) => setActiveTab(tab);

  return {
    tabs,
    activeTab,
    handleTabChange,
    handleSave,
    handleCancel,
    saveButtonIsActive,
  };
};

export default useQuickSettingsInformationBoard;
