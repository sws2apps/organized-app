import { useAppTranslation } from '@hooks/index';
import { FormControlLabel, RadioGroup } from '@mui/material';
import { Radio, Typography } from '@components/index';
import { AssignmentCard, CARD_LABEL } from '@definition/territory';

// Digital or printed card; neither ticked while an older record has no say
const CardField = ({
  value,
  onChange,
}: {
  value?: AssignmentCard;
  // undefined when the chosen one is clicked again: not recorded
  onChange: (next?: AssignmentCard) => void;
}) => {
  const { t } = useAppTranslation();
  return (
    <RadioGroup
      row
      aria-label={t('tr_territoryCard')}
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value as AssignmentCard)}
      sx={{ gap: '0 16px', width: '100%' }}
    >
      {(Object.keys(CARD_LABEL) as AssignmentCard[]).map((card) => (
        <FormControlLabel
          key={card}
          value={card}
          control={
            <Radio onClick={() => card === value && onChange(undefined)} />
          }
          label={<Typography>{t(CARD_LABEL[card])}</Typography>}
        />
      ))}
    </RadioGroup>
  );
};

export default CardField;
