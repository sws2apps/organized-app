import { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import { InfoNote } from '@components/index';
import { useBreakpoints } from '@hooks/index';
import { territoriesState } from '@states/territories';
import Card from '@components/card';
import AssignmentHistory from '../components/assignment_history';
import TerritoryHistory from './territory_history';

const TerritoriesHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { laptopUp } = useBreakpoints();

  const territories = useAtomValue(territoriesState);

  const [picked, setPicked] = useState<string | undefined>();

  const selectedId = id ?? picked;
  const selected = territories.find((item) => item.id === selectedId);

  const handleSelect = (territoryId: string) => {
    if (laptopUp) {
      setPicked(territoryId);
      return;
    }

    navigate(`/territories/history/${territoryId}`);
  };

  if (id && !laptopUp) {
    return selected ? (
      <TerritoryHistory territory={selected} />
    ) : (
      <InfoNote message="This territory no longer exists." />
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          mobile: 'minmax(0, 1fr)',
          laptop: selected ? 'minmax(0, 1fr) 420px' : 'minmax(0, 1fr)',
        },
        gap: '16px',
        alignItems: 'start',
      }}
    >
      <Card>
        <AssignmentHistory
          territories={territories}
          limit={200}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </Card>

      {laptopUp && selected && <TerritoryHistory territory={selected} />}
    </Box>
  );
};

export default TerritoriesHistory;
