import { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router';
import { InfoNote } from '@components/index';
import { IconDelete, IconPrint, IconSave } from '@icons/index';
import { useBreakpoints } from '@hooks/index';
import useTerritoryDetails from '@features/territories/details/useTerritoryDetails';
import PageTitle from '@components/page_title';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import TerritoryDetailsContainer from '@features/territories/details';
import TerritoryDelete from '@features/territories/details/territory_delete';
import TerritoryPrint from '@features/territories/details/territory_print';

const TerritoryDetailsPage = () => {
  const navigate = useNavigate();

  const [printOpen, setPrintOpen] = useState(false);
  const { tablet688Up } = useBreakpoints();

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
        secondaryTitle={
          isNew ? undefined : `${territory.name}, ${territory.city}`
        }
        onBack={() => navigate('/territories')}
        buttons={
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
        }
      />

      <TerritoryDetailsContainer
        territory={territory}
        onChange={handleChange}
      />
    </Box>
  );
};

export default TerritoryDetailsPage;
