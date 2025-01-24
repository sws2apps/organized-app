import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { FieldContainer } from '../shared_styles';
import { FormS4Props } from '../index.types';
import useBibleStudies from './useBibleStudies';
import BibleStudiesList from './bible_studies_list';
import BibleStudySelector from '@features/ministry/report/bible_study_selector';
import StandardEditor from '@features/ministry/report/standard_editor';
import Typography from '@components/typography';

const BibleStudies = (props: FormS4Props) => {
  const { t } = useAppTranslation();

  const { tabletUp } = useBreakpoints();

  const {
    value,
    handleBibleStudyChange,
    read_only,
    bibleStudyRef,
    isSelf,
    handleCheckSelected,
    handleBibleStudyRecordsChange,
    bible_studies_records,
    handleBibleStudyDelete,
    bibleStudiesValidator,
  } = useBibleStudies(props);

  return (
    <FieldContainer
      sx={{
        gap: '4px',
        alignItems: tabletUp ? 'flex-start' : 'center',
        flexDirection: 'column',
      }}
      ref={bibleStudyRef}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: tabletUp ? 'row' : 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        {isSelf && (
          <BibleStudySelector
            anchorEl={bibleStudyRef}
            editable={read_only ? false : props.publisher && isSelf}
            handleCheckSelected={handleCheckSelected}
            onChange={handleBibleStudyRecordsChange}
          />
        )}

        {!isSelf && <Typography>{t('tr_individualBibleStudies')}</Typography>}

        <StandardEditor
          readOnly={read_only}
          value={value}
          onChange={handleBibleStudyChange}
          validator={bibleStudiesValidator}
        />
      </Box>

      {isSelf && (
        <BibleStudiesList
          readOnly={read_only}
          bibleStudies={bible_studies_records}
          onDelete={handleBibleStudyDelete}
        />
      )}
    </FieldContainer>
  );
};

export default BibleStudies;
