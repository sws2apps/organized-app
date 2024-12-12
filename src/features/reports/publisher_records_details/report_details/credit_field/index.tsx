import { useBreakpoints } from '@hooks/index';
import { Field } from '../shared_styles';
import useCreditField from './useCreditField';
import HoursCreditPresets from '@features/ministry/report/hours_credit_presets';
import StandardEditor from '@features/ministry/report/standard_editor';

const CreditField = () => {
  const { tabletUp } = useBreakpoints();

  const {
    credit,
    handleCreditChange,
    handleSelectPreset,
    creditRef,
    readOnly,
  } = useCreditField();

  return (
    <Field ref={creditRef} sx={{ flexDirection: tabletUp ? 'row' : 'column' }}>
      <HoursCreditPresets
        readOnly={readOnly}
        anchorEl={creditRef}
        onSelect={handleSelectPreset}
      />
      <StandardEditor
        readOnly={readOnly}
        value={credit}
        onChange={handleCreditChange}
      />
    </Field>
  );
};

export default CreditField;
