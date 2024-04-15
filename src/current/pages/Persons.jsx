import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { alpha } from '@mui/material/styles';
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
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { PersonAdvancedSearch, PersonCard, PersonCustomFilter, PersonRecents } from '../features/persons';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';
import { currentStudentState, isStudentDeleteState } from '../states/person';
import { themeOptionsState } from '../states/theme';
import { Persons as PersonsData } from '../classes/Persons';
import SearchBar from '../components/SearchBar';
import { Setting } from '../classes/Setting';

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
  const { t } = useTranslation('ui');
  const navigate = useNavigate();

  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });

  let searchParams = localStorage.getItem('searchParams');
  searchParams = searchParams ? JSON.parse(searchParams) : {};
  const txtSearchInitial = searchParams.txtSearch || '';

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [persons, setPersons] = useState([]);
  const [anchorElMenuSmall, setAnchorElMenuSmall] = useState(null);
  const [txtSearch, setTxtSearch] = useState(txtSearchInitial);
  const [isSearch, setIsSearch] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const [isStudentDelete, setIsStudentDelete] = useRecoilState(isStudentDeleteState);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const currentStudent = useRecoilValue(currentStudentState);
  const themeOptions = useRecoilValue(themeOptionsState);

  const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
  const secretaryRole = Setting.cong_role.includes('secretary');
  const coordinatorRole = Setting.cong_role.includes('coordinator');
  const publicTalkCoordinatorRole = Setting.cong_role.includes('public_talk_coordinator');

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

  const handleDelete = async () => {
    const varID = currentStudent.person_uid;
    await PersonsData.delete(varID);

    let newPersons = persons.filter((person) => person.person_uid !== varID);
    setIsStudentDelete(false);
    setPersons(newPersons);

    setAppSnackOpen(true);
    setAppSeverity('success');
    setAppMessage(t('deleteSucess'));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (value) => {
    let searchParams = localStorage.getItem('searchParams');
    searchParams = searchParams ? JSON.parse(searchParams) : {};
    searchParams.txtSearch = value;
    setTxtSearch(value);

    localStorage.setItem('searchParams', JSON.stringify(searchParams));
  };

  const handleSearchStudent = useCallback(() => {
    setTabValue(0);
    setAdvancedOpen(false);

    handleCloseMenuSmall();

    let searchParams = localStorage.getItem('searchParams');
    searchParams = searchParams ? JSON.parse(searchParams) : {};

    const txtSearch = searchParams.txtSearch || '';
    const isMale = searchParams.isMale === undefined ? false : searchParams.isMale;
    const isFemale = searchParams.isFemale === undefined ? false : searchParams.isFemale;
    const isUnassigned = searchParams.isUnassigned === undefined ? false : searchParams.isUnassigned;
    const assTypes = searchParams.assTypes || [];
    const filter = searchParams.filter === undefined ? 'allPersons' : searchParams.filter;
    const fsg = searchParams.fsg === undefined ? '' : searchParams.fsg;

    setIsSearch(true);
    setTimeout(async () => {
      const result = PersonsData.filter({
        txtSearch,
        isMale,
        isFemale,
        isUnassigned,
        assTypes,
        filter,
        fsg,
      });
      setPersons(result);
      setIsSearch(false);
    }, [1000]);
  }, []);

  const handleSearchEnter = (e) => {
    if (e.key === 'Enter') handleSearchStudent();
  };

  useEffect(() => {
    if (!mdUp) setAnchorElMenuSmall(null);
  }, [mdUp]);

  useEffect(() => {
    handleSearchStudent();
  }, [handleSearchStudent]);

  return (
    <>
      {isStudentDelete && (
        <Dialog open={isStudentDelete} onClose={handleClose}>
          <DialogTitle>
            <Box sx={{ lineHeight: 1.2 }}>
              {t('deleteTitle', {
                currentStudent: currentStudent.name,
              })}
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">{t('deleteConfirmation')}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDelete} color="primary">
              {t('delete')}
            </Button>
            <Button onClick={handleClose} color="primary" autoFocus>
              {t('cancel')}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Typography sx={{ margin: '0px 0px 20px 0px', textTransform: 'uppercase', fontWeight: 'bold' }}>
        {t('persons')}
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
        <SearchBar minWidth={'280px'} txtSearch={txtSearch} onChange={handleSearchChange} onKeyUp={handleSearchEnter} />

        {mdUp && (
          <Box>
            {lmmoRole && (
              <IconButton
                onClick={handleToggleAdvanced}
                sx={{
                  backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.5),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.3),
                  },
                  margin: '-5px 5px 0 0',
                }}
              >
                {advancedOpen ? (
                  <ExpandLessIcon sx={{ fontSize: '25px' }} />
                ) : (
                  <ExpandMoreIcon sx={{ fontSize: '25px' }} />
                )}
              </IconButton>
            )}

            <IconButton
              sx={{
                backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.5),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.3),
                },
                marginTop: '-5px',
                marginRight: '5px',
              }}
              onClick={handleSearchStudent}
            >
              <PersonSearchIcon sx={{ fontSize: '25px' }} />
            </IconButton>

            {(lmmoRole || secretaryRole || coordinatorRole || publicTalkCoordinatorRole) && (
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
            )}
          </Box>
        )}

        {!mdUp && (
          <>
            {!lmmoRole && !secretaryRole && !coordinatorRole && !publicTalkCoordinatorRole && (
              <IconButton
                sx={{
                  backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.5),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.3),
                  },
                  marginTop: '-5px',
                  marginRight: '5px',
                }}
                onClick={handleSearchStudent}
              >
                <PersonSearchIcon sx={{ fontSize: '25px' }} />
              </IconButton>
            )}

            {(lmmoRole || secretaryRole || coordinatorRole || publicTalkCoordinatorRole) && (
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
            )}

            {(lmmoRole || secretaryRole || coordinatorRole || publicTalkCoordinatorRole) && (
              <Menu
                id="persons-small-menu"
                anchorEl={anchorElMenuSmall}
                open={!mdUp && openMenuSmall}
                onClose={handleCloseMenuSmall}
                MenuListProps={{
                  'aria-labelledby': 'persons-small-button',
                }}
              >
                {lmmoRole && (
                  <MenuItem onClick={handleToggleAdvanced}>
                    <ListItemIcon>
                      {advancedOpen ? (
                        <ExpandLessIcon sx={{ fontSize: '25px' }} />
                      ) : (
                        <ExpandMoreIcon sx={{ fontSize: '25px' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText>{advancedOpen ? t('hideAvancedSearch') : t('advancedSearch')}</ListItemText>
                  </MenuItem>
                )}

                <MenuItem onClick={handleSearchStudent}>
                  <ListItemIcon>
                    <PersonSearchIcon sx={{ fontSize: '25px' }} />
                  </ListItemIcon>
                  <ListItemText>{t('search')}</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleAddStudent}>
                  <ListItemIcon>
                    <AddCircleIcon sx={{ fontSize: '25px' }} />
                  </ListItemIcon>
                  <ListItemText>{t('addNew')}</ListItemText>
                </MenuItem>
              </Menu>
            )}
          </>
        )}
      </Box>

      {lmmoRole && (
        <PersonAdvancedSearch
          advancedOpen={advancedOpen}
          setAdvancedOpen={(value) => setAdvancedOpen(value)}
          handleSearchStudent={handleSearchStudent}
        />
      )}

      {(secretaryRole || coordinatorRole || publicTalkCoordinatorRole) && (
        <PersonCustomFilter handleSearchStudent={handleSearchStudent} />
      )}

      <Box sx={{ marginBottom: '10px' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
            <Tab label={`${t('searchResult')} (${isSearch ? 0 : persons.length})`} {...a11yProps(0)} />
            <Tab label={t('recentPersons')} {...a11yProps(1)} />
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
