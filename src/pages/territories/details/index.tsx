import { useState } from 'react';
import { Box } from '@mui/material';
import { Navigate } from 'react-router';
import { InfoNote } from '@components/index';
import {
  IconCheckCircle,
  IconClose,
  IconDelete,
  IconPrint,
  IconRaiseHand,
} from '@icons/index';
import { useBreakpoints, useCurrentUser } from '@hooks/index';
import { displaySnackNotification } from '@services/states/app';
import { CURRENT_PUBLISHER } from '@features/territories/helpers';
import useTerritoryDetails from '@features/territories/details/useTerritoryDetails';
import PageTitle from '@components/page_title';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import TerritoryDetailsContainer from '@features/territories/details';
import TerritoryDelete from '@features/territories/details/territory_delete';
import TerritoryExport from '@features/territories/details/territory_export';
import useParentPage from '@features/territories/useParentPage';
import { Territory } from '@definition/territory';

const publisherNoteOf = (territory: Territory) => {
  if (territory.holder === CURRENT_PUBLISHER) {
    return 'You are working this territory.';
  }
  if (territory.requestedBy === CURRENT_PUBLISHER) {
    return 'You asked for this territory. You will hear back when it is assigned.';
  }
  if (territory.requestedBy) {
    return 'Someone else has already asked for this territory.';
  }
  if (territory.status !== 'available') {
    return 'This territory is being worked right now.';
  }
  return undefined;
};

const titleOf = (territory: Territory, isNew: boolean) =>
  isNew
    ? 'New territory'
    : [`Territory ${territory.number}`, territory.name]
        .filter(Boolean)
        .join(' · ');

const TerritoryDetailsPage = () => {
  const { parent, goBack } = useParentPage();

  const [exportOpen, setExportOpen] = useState(false);
  const { tablet688Up } = useBreakpoints();

  const { isElder, isServiceCommittee } = useCurrentUser();
  const isTerritoryEditor = isElder || isServiceCommittee;

  const {
    territory,
    isNew,
    handleChange,
    handleDelete,
    deleteOpen,
    setDeleteOpen,
  } = useTerritoryDetails();

  if (!territory) {
    return <InfoNote message="This territory no longer exists." />;
  }

  // only those who manage territories add new ones
  if (isNew && !isTerritoryEditor) {
    return <Navigate to="/territories" replace />;
  }

  const requestedByMe = territory.requestedBy === CURRENT_PUBLISHER;
  const heldByMe = territory.holder === CURRENT_PUBLISHER;

  const canRequest = territory.status === 'available' && !territory.requestedBy;

  const publisherNote = publisherNoteOf(territory);

  const setRequest = (requested: boolean) => {
    handleChange({
      ...territory,
      requestedBy: requested ? CURRENT_PUBLISHER : undefined,
    });

    displaySnackNotification({
      header: requested ? 'Request sent' : 'Request cancelled',
      message: requested
        ? `You asked for territory ${territory.number}.`
        : `Your request for territory ${territory.number} was withdrawn.`,
      severity: 'success',
      icon: <IconCheckCircle color="var(--white)" />,
    });
  };

  const publisherButtons = (
    <NavBarButtonGroup>
      {requestedByMe && (
        <NavBarButton
          text="Cancel request"
          icon={<IconClose />}
          onClick={() => setRequest(false)}
        />
      )}
      {canRequest && (
        <NavBarButton
          text="Request"
          icon={<IconRaiseHand />}
          main
          onClick={() => setRequest(true)}
        />
      )}
    </NavBarButtonGroup>
  );

  const editorButtons = !isNew && (
    <NavBarButtonGroup>
      <NavBarButton
        text="Delete"
        color="red"
        icon={<IconDelete />}
        onClick={() => setDeleteOpen(true)}
      />
      <NavBarButton
        text="Export"
        icon={<IconPrint />}
        onClick={() => setExportOpen(true)}
      />
    </NavBarButtonGroup>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        paddingBottom: tablet688Up ? '0px' : '60px',
      }}
    >
      {exportOpen && (
        <TerritoryExport
          territory={territory}
          onClose={() => setExportOpen(false)}
        />
      )}

      <TerritoryDelete
        open={deleteOpen}
        number={territory.number}
        onClose={() => setDeleteOpen(false)}
        onDelete={handleDelete}
      />

      <PageTitle
        title={titleOf(territory, isNew)}
        secondaryTitle={parent}
        onBack={goBack}
        buttons={
          isTerritoryEditor ? editorButtons || undefined : publisherButtons
        }
      />

      {!isTerritoryEditor && publisherNote && (
        <InfoNote message={publisherNote} />
      )}

      <TerritoryDetailsContainer
        territory={territory}
        onChange={handleChange}
        readOnly={!isTerritoryEditor}
        showPrivate={isTerritoryEditor || heldByMe}
      />
    </Box>
  );
};

export default TerritoryDetailsPage;
