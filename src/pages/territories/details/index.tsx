import TerritorySyncStatus from '@features/territories/components/sync_status';
import useTerritoryAccess from '@features/territories/useTerritoryAccess';
import { territoryPermissions } from '@services/app/territory_access';
import { getTranslation } from '@services/i18n/translation';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Navigate } from 'react-router';
import { Button, InfoNote } from '@components/index';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import {
  IconCheckCircle,
  IconClose,
  IconDelete,
  IconMoveBack,
  IconMoveForward,
  IconExport,
  IconRaiseHand,
} from '@icons/index';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { displaySnackNotification } from '@services/states/app';
import useTerritoryDetails from '@features/territories/details/useTerritoryDetails';
import PageTitle from '@components/page_title';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import TerritoryDetailsContainer from '@features/territories/details';
import TerritoryDelete from '@features/territories/details/territory_delete';
import TerritoryExport from '@features/territories/details/territory_export';
import AssignReturnDialogs from '@features/territories/components/assign_return_dialogs';
import useAssignReturn from '@features/territories/useAssignReturn';
import useParentPage from '@features/territories/useParentPage';
import { territoryHolderText } from '@features/territories/group_holder';
import { Territory } from '@definition/territory';

const publisherNoteOf = (territory: Territory, me: string) => {
  if (territory.holder === me) {
    return getTranslation({ key: 'tr_territoryYouAreWorkingThisTerritory' });
  }
  if (territory.requestedBy === me) {
    return getTranslation({
      key: 'tr_territoryYouAskedForThisTerritoryYouWillHearBack',
    });
  }
  if (territory.requestedBy) {
    return getTranslation({
      key: 'tr_territorySomeoneElseHasAlreadyAskedForThisTerritory',
    });
  }
  if (territory.status !== 'available') {
    return getTranslation({
      key: 'tr_territoryThisTerritoryIsBeingWorkedRightNow',
    });
  }
  return undefined;
};

const titleOf = (territory: Territory, isNew: boolean) =>
  isNew
    ? getTranslation({ key: 'tr_territoryNewTerritory' })
    : [
        getTranslation({
          key: 'tr_territoryTerritory',
          params: { number: territory.number },
        }),
        territory.name,
      ]
        .filter(Boolean)
        .join(' · ');

const TerritoryDetailsPage = () => {
  const { t } = useAppTranslation();

  const { parent, goBack } = useParentPage();

  const [exportOpen, setExportOpen] = useState(false);
  const { tablet688Up } = useBreakpoints();

  const context = useTerritoryAccess();
  const { editor: isTerritoryEditor, publisher: me } = context;

  const {
    territory,
    isNew,
    isNewPage,
    handleChange,
    commitNew,
    handleDelete,
    deleteOpen,
    setDeleteOpen,
    blocker,
  } = useTerritoryDetails();

  const actions = useAssignReturn();

  // the "new note" mark is for an editor who has not looked yet
  const unread = isTerritoryEditor && !!territory?.reviewNeeded;
  useEffect(() => {
    if (unread && territory)
      handleChange({ ...territory, reviewNeeded: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unread, territory?.id]);

  if (!territory) {
    return <InfoNote message={t('tr_territoryThisTerritoryNoLongerExists')} />;
  }

  // only those who manage territories add new ones
  if (isNew && !isTerritoryEditor) {
    return <Navigate to="/territories" replace />;
  }

  const permissions = territoryPermissions(territory, context);
  if (!isNew && !permissions.view)
    return <Navigate to="/territories" replace />;
  const requestedByMe = permissions.cancelRequest;
  const heldByMe = !!me && territory.holder === me;

  const canRequest = permissions.request;

  const isOut =
    territory.status === 'in_work' || territory.status === 'overdue';

  const returnButton = (
    <NavBarButton
      text={t('tr_return')}
      icon={<IconMoveBack />}
      main
      onClick={() => actions.openReturn(territory.id)}
    />
  );

  const publisherNote = publisherNoteOf(territory, me);

  const setRequest = (requested: boolean) => {
    handleChange({
      ...territory,
      requestedBy: requested ? me : undefined,
    });

    displaySnackNotification({
      header: requested
        ? t('tr_territoryRequestSent')
        : t('tr_territoryRequestCancelled'),
      message: requested
        ? t('tr_territoryYouAskedForTerritory', {
            number: territory.number,
          })
        : t('tr_territoryYourRequestForTerritoryWasWithdrawn', {
            number: territory.number,
          }),
      severity: 'success',
      icon: <IconCheckCircle color="var(--white)" />,
    });
  };

  const publisherButtons = (
    <NavBarButtonGroup>
      {requestedByMe && (
        <NavBarButton
          text={t('tr_territoryCancelRequest')}
          icon={<IconClose />}
          onClick={() => setRequest(false)}
        />
      )}
      {canRequest && (
        <NavBarButton
          text={t('tr_territoryRequest')}
          icon={<IconRaiseHand />}
          main
          onClick={() => setRequest(true)}
        />
      )}
      {permissions.return && returnButton}
    </NavBarButtonGroup>
  );

  // an empty group still draws the bar's backdrop
  const hasPublisherButtons = requestedByMe || canRequest || permissions.return;

  const editorButtons = !isNew && (
    <NavBarButtonGroup>
      <NavBarButton
        text={t('tr_delete')}
        color="red"
        icon={<IconDelete />}
        onClick={() => setDeleteOpen(true)}
      />
      <NavBarButton
        text={t('tr_export')}
        icon={<IconExport />}
        onClick={() => setExportOpen(true)}
      />
      {isOut ? (
        returnButton
      ) : (
        <NavBarButton
          text={t('tr_assign')}
          icon={<IconMoveForward />}
          main
          onClick={() => actions.openAssign(territory.id)}
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
      {exportOpen && (
        <TerritoryExport
          territory={territory}
          onClose={() => setExportOpen(false)}
        />
      )}

      <AssignReturnDialogs actions={actions} canAssign={isTerritoryEditor} />

      {blocker.state === 'blocked' && (
        <Dialog
          onClose={blocker.reset}
          open
          title={t('tr_territoryDiscardTheNewTerritory')}
          description={t('tr_territoryItIsSavedOnceItHasANumberNo')}
        >
          <DialogActions>
            <Button variant="secondary" onClick={blocker.reset}>
              {t('tr_territoryKeepEditing')}
            </Button>
            <Button variant="main" color="red" onClick={blocker.proceed}>
              {t('tr_territoryDiscard')}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <TerritoryDelete
        open={deleteOpen}
        number={territory.number}
        holder={territoryHolderText(territory)}
        onClose={() => setDeleteOpen(false)}
        onDelete={handleDelete}
      />

      <PageTitle
        title={titleOf(territory, isNew)}
        secondaryTitle={parent}
        onBack={goBack}
        buttons={
          isTerritoryEditor
            ? editorButtons || undefined
            : (hasPublisherButtons && publisherButtons) || undefined
        }
      />
      <TerritorySyncStatus />

      {!isTerritoryEditor && publisherNote && (
        <InfoNote message={publisherNote} />
      )}

      <TerritoryDetailsContainer
        territory={territory}
        onChange={handleChange}
        onCommit={commitNew}
        openOnDetails={isNewPage}
        readOnly={!isTerritoryEditor}
        showPrivate={permissions.private}
        heldByMe={heldByMe}
      />
    </Box>
  );
};

export default TerritoryDetailsPage;
