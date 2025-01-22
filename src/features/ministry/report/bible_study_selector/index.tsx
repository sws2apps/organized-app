import { Box, Menu } from '@mui/material';
import { IconAdd, IconArrowDown } from '@components/icons';
import { BibleStudySelectorProps } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useBibleSelector from './useBibleSelector';
import BibleStudyItem from './bible_study_item';
import MenuItem from '@components/menuitem';
import Typography from '@components/typography';
import BibleStudyEditor from '../form_S4/bible_studies/editor';

const BibleStudySelector = (props: BibleStudySelectorProps) => {
  const { t } = useAppTranslation();

  const {
    selectorOpen,
    handleToggleSelector,
    handleAddNewBibleStudy,
    bibleStudies,
    editorOpen,
    handleCloseEditor,
    bibleStudy,
    handleEditBibleStudy,
    handleSelectBibleStudy,
  } = useBibleSelector(props);

  return (
    <>
      {editorOpen && (
        <BibleStudyEditor
          open={editorOpen}
          onClose={handleCloseEditor}
          bibleStudy={bibleStudy}
        />
      )}

      <Box
        onClick={props.editable ? handleToggleSelector : null}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          cursor: props.editable ? 'pointer' : 'unset',
        }}
      >
        <Typography>{t('tr_individualBibleStudies')}</Typography>

        {props.editable && (
          <IconArrowDown
            color="var(--black)"
            sx={{ transform: selectorOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        )}
      </Box>

      {props.editable && props.anchorEl.current && (
        <Menu
          disableAutoFocus={true}
          disableScrollLock={true}
          anchorEl={props.anchorEl.current}
          open={selectorOpen}
          onClose={handleToggleSelector}
          sx={{
            padding: '8px 0',
            marginTop: '7px',
            '& li': {
              borderBottom: '1px solid var(--accent-200)',
            },
            '& li:last-child': {
              borderBottom: 'none',
            },
          }}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          slotProps={{
            paper: {
              style: {
                borderRadius: 'var(--radius-l)',
                border: '1px solid var(--accent-200)',
                backgroundColor: 'var(--white)',
                width: props.anchorEl.current.clientWidth,
              },
            },
          }}
        >
          {bibleStudies.map((study) => (
            <BibleStudyItem
              key={study.person_uid}
              bibleStudy={study}
              onEdit={handleEditBibleStudy}
              selected={props.handleCheckSelected(study)}
              onSelect={(study) => handleSelectBibleStudy(study)}
            />
          ))}

          <MenuItem
            onClick={handleAddNewBibleStudy}
            sx={{ height: '40px', minHeight: '40px' }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <IconAdd color="var(--accent-dark)" />
              <Typography color="var(--accent-dark)">
                {t('tr_addNewStudy')}
              </Typography>
            </Box>
          </MenuItem>
        </Menu>
      )}
    </>
  );
};

export default BibleStudySelector;
