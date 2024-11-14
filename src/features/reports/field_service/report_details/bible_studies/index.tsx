import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { Field } from '../shared_styles';
import { BibleStudiesProps } from './index.types';
import useBibleStudies from './useBibleStudies';
import StandardEditor from '@features/ministry/report/standard_editor';
import Typography from '@components/typography';

const BibleStudies = ({ person }: BibleStudiesProps) => {
  const { t } = useAppTranslation();

  const { tabletUp } = useBreakpoints();

  const { bible_studies, handleBibleStudyChange, readOnly } =
    useBibleStudies(person);

  return (
    <Field sx={{ flexDirection: tabletUp ? 'row' : 'column' }}>
      <Typography sx={{ flex: 1 }}>{t('tr_individualBibleStudies')}</Typography>
      <StandardEditor
        readOnly={readOnly}
        value={bible_studies}
        onChange={handleBibleStudyChange}
      />
    </Field>
  );
};

export default BibleStudies;