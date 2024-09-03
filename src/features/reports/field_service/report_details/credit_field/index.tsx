import { useBreakpoints } from '@hooks/index';
import { Field } from '../shared_styles';
import { HoursFieldProps } from './index.types';
import useCreditField from './useCreditField';
import HoursCreditPresets from '@features/ministry/report/hours_credit_presets';
import StandardEditor from '@features/ministry/report/standard_editor';

const CreditField = ({ person }: HoursFieldProps) => {
  const { tabletUp } = useBreakpoints();

  const { credit, handleCreditChange, handleSelectPreset, creditRef } =
    useCreditField(person);

  return (
    <Field ref={creditRef} sx={{ flexDirection: tabletUp ? 'row' : 'column' }}>
      <HoursCreditPresets anchorEl={creditRef} onSelect={handleSelectPreset} />
      <StandardEditor value={credit} onChange={handleCreditChange} />
    </Field>
  );
};

export default CreditField;
