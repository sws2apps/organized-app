import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { styled, alpha } from '@mui/material/styles';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import SearchIcon from '@mui/icons-material/Search';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { PersonAdvancedSearch, PersonCard, PersonRecents } from '../features/persons';
import { dbDeleteStudent, dbFilterStudents } from '../indexedDb/dbPersons';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';
import { allStudentsState, studentsQueryState } from '../states/persons';
import { currentStudentState, isStudentDeleteState } from '../states/person';
import { themeOptionsState } from '../states/theme';

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(0.8, 1, 0.8, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
  '&.MuiInputBase-root': {
    width: '100%',
  },
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const Persons = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });

  const [searchParams, setSearchParams] = useSearchParams();

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [persons, setStudents] = useState([]);
  const [anchorElMenuSmall, setAnchorElMenuSmall] = useState(null);
  const [txtSearch, setTxtSearch] = useState('');
  const [isMale, setIsMale] = useState(false);
  const [isFemale, setIsFemale] = useState(false);
  const [assTypes, setAssTypes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const [isStudentDelete, setIsStudentDelete] = useRecoilState(isStudentDeleteState);
  const [dbStudents, setDbStudents] = useRecoilState(allStudentsState);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setStudentsQuery = useSetRecoilState(studentsQueryState);

  const currentStudent = useRecoilValue(currentStudentState);
  const themeOptions = useRecoilValue(themeOptionsState);

  const openMenuSmall = Boolean(anchorElMenuSmall);

  const handleClickMenuSmall = (event) => {
    setAnchorElMenuSmall(event.currentTarget);
  };

  const handleCloseMenuSmall = () => {
    setAnchorElMenuSmall(null);
  };

  const handleToggleAdvanced = () => {
    handleCloseMenuSmall();
    setAdvancedOpen(!advancedOpen);
  };

  const handleAddStudent = () => {
    navigate('/persons/new');
  };

  const handleClose = () => {
    setIsStudentDelete(false);
  };

  const handleSearchStudent = useCallback(
    async (txtSearch, isMale, isFemale, assTypes) => {
      setTabValue(0);

      handleCloseMenuSmall();

      if (txtSearch.length === 0 && !isMale && !isFemale && assTypes.length === 0) {
        setStudentsQuery({});
        setSearchParams('');
      } else {
        const query = { search: txtSearch, isMale, isFemale, type: assTypes };
        setStudentsQuery(query);
        setSearchParams(query);
      }

      setIsSearch(true);
      setTimeout(async () => {
        let obj = { txtSearch, isMale, isFemale, assTypes };
        const data = await dbFilterStudents(obj);
        setAdvancedOpen(false);
        setStudents(data);
        setIsSearch(false);
      }, [1000]);
    },
    [setSearchParams, setStudentsQuery]
  );

  const handleDelete = async () => {
    const varID = currentStudent.person_uid;
    await dbDeleteStudent(varID);
    let newPersons = persons.filter((person) => person.person_uid !== varID);
    let dbNewPersons = dbStudents.filter((person) => person.person_uid !== varID);
    setIsStudentDelete(false);
    setStudents(newPersons);
    setDbStudents(dbNewPersons);

    setAppSnackOpen(true);
    setAppSeverity('success');
    setAppMessage(t('persons.deleteSucess'));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const getQuery = async () => {
      const search = searchParams.get('search') || '';
      setTxtSearch(search);
      const isMale = searchParams.get('isMale') === 'true' ? true : false;
      setIsMale(isMale);
      const isFemale = searchParams.get('isFemale') === 'true' ? true : false;
      setIsFemale(isFemale);
      const types = searchParams.getAll('type') || [];
      const assTypes = types.map((type) => +type);
      setAssTypes(assTypes);

      if (search?.length > 0 || isMale || isFemale || assTypes.length > 0) {
        await handleSearchStudent(search, isMale, isFemale, assTypes);
      }
    };

    getQuery();
  }, [handleSearchStudent, searchParams]);

  const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
      handleSearchStudent(txtSearch, isMale, isFemale, assTypes);
    }
  };

  useEffect(() => {
    if (!mdUp) setAnchorElMenuSmall(null);
  }, [mdUp]);

  return (
    <>
      {isStudentDelete && (
        <Dialog open={isStudentDelete} onClose={handleClose}>
          <DialogTitle>
            <Box sx={{ lineHeight: 1.2 }}>
              {t('persons.deleteTitle', {
                currentStudent: currentStudent.name,
              })}
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">{t('persons.deleteConfirmation')}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDelete} color="primary">
              {t('global.delete')}
            </Button>
            <Button onClick={handleClose} color="primary" autoFocus>
              {t('global.cancel')}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Typography sx={{ margin: '0px 0px 20px 0px', textTransform: 'uppercase', fontWeight: 'bold' }}>
        {t('dashboard.persons')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: '10px',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            borderRadius: '5px',
            backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.25),
            '&:hover': {
              backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.15),
            },
            marginBottom: '5px',
            flexGrow: 1,
            minWidth: '330px',
          }}
        >
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder={t('persons.search')}
            inputProps={{ 'aria-label': 'search' }}
            value={txtSearch}
            onChange={(e) => setTxtSearch(e.target.value)}
            onKeyUp={handleSearchEnter}
          />
        </Box>

        {mdUp && (
          <Box>
            <IconButton
              onClick={handleToggleAdvanced}
              sx={{
                backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.5),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.3),
                },
                margin: '-5px 5px 0 5px',
              }}
            >
              {advancedOpen ? (
                <ExpandLessIcon sx={{ fontSize: '25px' }} />
              ) : (
                <ExpandMoreIcon sx={{ fontSize: '25px' }} />
              )}
            </IconButton>
            <IconButton
              sx={{
                backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.5),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.3),
                },
                marginTop: '-5px',
                marginRight: '5px',
              }}
              onClick={() => handleSearchStudent(txtSearch, isMale, isFemale, assTypes)}
            >
              <PersonSearchIcon sx={{ fontSize: '25px' }} />
            </IconButton>
            <IconButton
              sx={{
                backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.5),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.3),
                },
                marginTop: '-5px',
              }}
              onClick={handleAddStudent}
            >
              <AddCircleIcon sx={{ fontSize: '25px' }} />
            </IconButton>
          </Box>
        )}
        {!mdUp && (
          <>
            <IconButton
              sx={{
                backgroundColor: '#ABB2B9',
                margin: '-5px 5px 0 5px',
              }}
              aria-label="more"
              id="persons-small-button"
              aria-controls={openMenuSmall ? 'persons-small-menu' : undefined}
              aria-expanded={openMenuSmall ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClickMenuSmall}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="persons-small-menu"
              anchorEl={anchorElMenuSmall}
              open={!mdUp && openMenuSmall}
              onClose={handleCloseMenuSmall}
              MenuListProps={{
                'aria-labelledby': 'persons-small-button',
              }}
            >
              <MenuItem onClick={handleToggleAdvanced}>
                <ListItemIcon>
                  {advancedOpen ? (
                    <ExpandLessIcon sx={{ fontSize: '25px' }} />
                  ) : (
                    <ExpandMoreIcon sx={{ fontSize: '25px' }} />
                  )}
                </ListItemIcon>
                <ListItemText>{advancedOpen ? t('global.hideAvancedSearch') : t('global.advancedSearch')}</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleSearchStudent(txtSearch, isMale, isFemale, assTypes)}>
                <ListItemIcon>
                  <PersonSearchIcon sx={{ fontSize: '25px' }} />
                </ListItemIcon>
                <ListItemText>{t('persons.search')}</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleAddStudent}>
                <ListItemIcon>
                  <AddCircleIcon sx={{ fontSize: '25px' }} />
                </ListItemIcon>
                <ListItemText>{t('persons.addNew')}</ListItemText>
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>

      <PersonAdvancedSearch
        advancedOpen={advancedOpen}
        setAdvancedOpen={(value) => setAdvancedOpen(value)}
        isMale={isMale}
        isFemale={isFemale}
        handleSearchStudent={(txtSearch, isMale, isFemale, assTypes) =>
          handleSearchStudent(txtSearch, isMale, isFemale, assTypes)
        }
        assTypes={assTypes}
        setIsMale={(value) => setIsMale(value)}
        setIsFemale={(value) => setIsFemale(value)}
        setAssTypes={(value) => setAssTypes(value)}
        txtSearch={txtSearch}
      />

      <Box sx={{ marginBottom: '10px' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
            <Tab label={`${t('persons.searchResult')} (${isSearch ? 0 : persons.length})`} {...a11yProps(0)} />
            <Tab label={t('persons.recentStudents')} {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          {!isSearch && (
            <>
              {persons.length > 0 && (
                <Grid container>
                  {persons.map((person) => (
                    <PersonCard key={person.person_uid} person={person} />
                  ))}
                </Grid>
              )}
            </>
          )}
          {isSearch && (
            <CircularProgress
              color="secondary"
              size={80}
              disableShrink={true}
              sx={{
                display: 'flex',
                margin: '20vh auto',
              }}
            />
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <PersonRecents />
        </TabPanel>
      </Box>
    </>
  );
};

export default Persons;
