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
  IconSave,
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
import TerritoryPrint from '@features/territories/details/territory_print';
import useParentPage from '@features/territories/useParentPage';

const TerritoryDetailsPage = () => {
  const { parent, goBack } = useParentPage();

  const [printOpen, setPrintOpen] = useState(false);
  const { tablet688Up } = useBreakpoints();

  const { isElder, isServiceCommittee } = useCurrentUser();
  const isTerritoryEditor = isElder || isServiceCommittee;

  const {
    territory,
    isNew,
    handleChange,
    canSave,
    handleSave,
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

  // why a publisher can't ask for it, when they can't
  const publisherNote = heldByMe
    ? 'You are working this territory.'
    : requestedByMe
      ? 'You asked for this territory. You will hear back when it is assigned.'
      : territory.requestedBy
        ? 'Someone else has already asked for this territory.'
        : territory.status !== 'available'
          ? 'This territory is being worked right now.'
          : undefined;

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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        paddingBottom: tablet688Up ? '0px' : '60px',
      }}
    >
      {printOpen && (
        <TerritoryPrint
          territory={territory}
          onClose={() => setPrintOpen(false)}
        />
      )}

      <TerritoryDelete
        open={deleteOpen}
        number={territory.number}
        onClose={() => setDeleteOpen(false)}
        onDelete={handleDelete}
      />

      <PageTitle
        title={isNew ? 'New territory' : `Territory ${territory.number}`}
        secondaryTitle={parent}
        onBack={goBack}
        buttons={
          !isTerritoryEditor ? (
            publisherButtons
          ) : (
            <NavBarButtonGroup>
              {!isNew && (
                <NavBarButton
                  text="Delete"
                  color="red"
                  icon={<IconDelete />}
                  onClick={() => setDeleteOpen(true)}
                />
              )}

              {isNew && (
                <NavBarButton
                  text="Save"
                  icon={<IconSave />}
                  disabled={!canSave}
                  onClick={handleSave}
                />
              )}

              {!isNew && (
                <NavBarButton
                  text="Print"
                  icon={<IconPrint />}
                  onClick={() => setPrintOpen(true)}
                />
              )}
            </NavBarButtonGroup>
          )
        }
      />

      {!isTerritoryEditor && publisherNote && (
        <InfoNote message={publisherNote} />
      )}

      <TerritoryDetailsContainer
        territory={territory}
        onChange={handleChange}
        readOnly={!isTerritoryEditor}
      />
    </Box>
  );
};

export default TerritoryDetailsPage;
