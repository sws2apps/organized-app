import { Box, Menu } from '@mui/material';
import { IconAdd, IconArrowDown } from '@components/icons';
import { BibleStudySelectorProps } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useBibleSelector from './useBibleSelector';
import BibleStudyItem from '../bible_study_item';
import MenuItem from '@components/menuitem';
import Typography from '@components/typography';

const BibleStudySelector = (props: BibleStudySelectorProps) => {
  const { t } = useAppTranslation();

  const {
    selectorOpen,
    handleToggleSelector,
    handleAddNewBibleStudy,
    bibleStudies,
  } = useBibleSelector();

  return (
    <>
      <Box
        onClick={handleToggleSelector}
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
        }}
      >
        <Typography>{t('tr_bibleStudies')}</Typography>
        <IconArrowDown
          color="var(--black)"
          sx={{ transform: selectorOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </Box>

      {props.anchorEl.current && (
        <Menu
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
              onSelectorClose={handleToggleSelector}
              date={props.date}
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
