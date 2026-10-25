import useTerritoryAccess from '@features/territories/useTerritoryAccess';
import { territoryHistoryForPublisher } from '@services/app/territory_access';
import { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { useAtom } from 'jotai';
import { InfoNote } from '@components/index';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { territoriesState } from '@states/territories';
import Card from '@components/card';
import AssignmentHistory from '@features/territories/components/assignment_history';
import TerritoryHistory from '@features/territories/history/territory_history';
import { Territory } from '@definition/territory';

const TerritoriesHistory = () => {
  const { t } = useAppTranslation();

  const { id } = useParams();
  const navigate = useNavigate();

  const { laptopUp } = useBreakpoints();

  const { editor, publisher, publisherId } = useTerritoryAccess();
  const [allTerritories, setTerritories] = useAtom(territoriesState);

  const territories = editor
    ? allTerritories
    : territoryHistoryForPublisher(allTerritories, publisher, publisherId);

  const onChange = editor
    ? (next: Territory) =>
        setTerritories((prev) =>
          prev.map((item) => (item.id === next.id ? next : item))
        )
    : undefined;

  const [picked, setPicked] = useState<string | undefined>();

  const selectedId = id ?? picked;
  const selected = territories.find((item) => item.id === selectedId);

  const handleSelect = (territoryId: string) => {
    if (laptopUp) {
      setPicked(territoryId);
      return;
    }

    navigate(`/territories/history/${territoryId}`, {
      state: { parent: 'tr_assignmentHistory' },
    });
  };

  if (id && !laptopUp) {
    return selected ? (
      <TerritoryHistory territory={selected} onChange={onChange} />
    ) : (
      <InfoNote message={t('tr_territoryThisTerritoryNoLongerExists')} />
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
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </Card>

      {laptopUp && selected && (
        <TerritoryHistory territory={selected} onChange={onChange} />
      )}
    </Box>
  );
};

export default TerritoriesHistory;
