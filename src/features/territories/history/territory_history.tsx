import { useAppTranslation } from '@hooks/index';
import { Stack } from '@mui/material';
import { Typography } from '@components/index';
import Card from '@components/card';
import {
  coveredDays,
  daysLabel,
  withAssignments,
} from '@features/territories/helpers';
import TerritoryAssignments from '@features/territories/details/territory_assignments';
import TerritorySummary from '@features/territories/components/territory_summary';
import { Territory } from '@definition/territory';

// editors open a record to read and fix it; everyone else only reads
const TerritoryHistory = ({
  territory,
  onChange,
}: {
  territory: Territory;
  onChange?: (territory: Territory) => void;
}) => {
  const { t } = useAppTranslation();
  return (
    <Card>
      <Stack spacing="4px">
        <Typography className="h2" color="var(--black)">
          {t('tr_territoryTerritory', { number: territory.number })}
        </Typography>
        <Typography className="body-small-regular" color="var(--grey-400)">
          {territory.name} · {territory.city}
        </Typography>
      </Stack>

      <TerritorySummary
        territory={territory}
        meta={
          coveredDays(territory) === null
            ? t('tr_territoryNeverCovered')
            : t('tr_territoryLastCoveredAgo', {
                days: daysLabel(coveredDays(territory) ?? 0),
              })
        }
      />

      <TerritoryAssignments
        territory={territory}
        onChange={
          onChange && ((next) => onChange(withAssignments(territory, next)))
        }
        onNotes={onChange && ((notes) => onChange({ ...territory, notes }))}
      />
    </Card>
  );
};

export default TerritoryHistory;
