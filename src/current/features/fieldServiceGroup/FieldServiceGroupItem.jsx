import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import AssistantIcon from '@mui/icons-material/Assistant';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import IconButton from '@mui/material/IconButton';
import InputIcon from '@mui/icons-material/Input';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Paper from '@mui/material/Paper';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import VerifiedIcon from '@mui/icons-material/Verified';
import maleIcon from '../../img/student_male.svg';
import femaleIcon from '../../img/student_female.svg';
import { themeOptionsState } from '../../states/theme';
import { FSGList } from '../../classes/FSGList';
import { Persons } from '../../classes/Persons';
import { useEffect, useState } from 'react';

const FieldServiceGroupItem = ({ currentList, group_index, group, isRefresh, setIsRefresh, allGroups }) => {
  const { t } = useTranslation('ui');

  const theme = useRecoilValue(themeOptionsState);

  const [selected, setSelected] = useState(null);
  const [options, setOptions] = useState([]);
  const [persons, setPersons] = useState([]);
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [currentPerson, setCurrentPerson] = useState(null);
  const [isAppointed, setIsAppointed] = useState(false);
  const [isOverseer, setIsOverseer] = useState(false);
  const [isAssistant, setIsAssistant] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const hasOverseer = group.persons.find((person) => person.isOverseer);
  const hasAssistant = group.persons.find((person) => person.isAssistant);

  const groupsArray = Array.from({ length: allGroups.length }, (a, b) => b + 1).filter(
    (item) => item !== group_index + 1
  );

  const finalGroups = groupsArray.map((group) => {
    const current = allGroups[group - 1];
    return { index: group, group_uid: current.group_uid };
  });

  const openMenu = Boolean(anchorElMenu);

  const getPersonIcon = (person) => {
    if (!person) return null;

    if (person.isOverseer || person.isAssistant) {
      return null;
    }

    let icon;
    if (person.isMale) icon = maleIcon;
    if (person.isFemale) icon = femaleIcon;

    return icon;
  };

  const handleClickMenu = (event) => {
    const parent = event.currentTarget.parentElement;
    const pElement = parent.querySelector('p');
    const current = pElement.dataset.person_uid;
    setCurrentPerson(current);

    const found = persons.find((person) => person.person_uid === current);
    setIsAppointed(found.isAppointed);
    setIsOverseer(found.isOverseer);
    setIsAssistant(found.isAssistant);

    setAnchorElMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  const handleDeleteGroup = async () => {
    const currentFSG = FSGList.get(currentList);
    await currentFSG.deleteGroup(group.group_uid);
    setIsRefresh(!isRefresh);
  };

  const handleAddPersonToGroup = async () => {
    if (selected !== null) {
      const currentFSG = FSGList.get(currentList);
      await currentFSG.addPersonToGroup(group.group_uid, selected.person_uid);
      setSelected(null);
      setIsRefresh(!isRefresh);
    }
  };

  const handleRemovePersonToGroup = async () => {
    handleCloseMenu();
    const currentFSG = FSGList.get(currentList);
    await currentFSG.removePersonFromGroup(group.group_uid, currentPerson);
    setIsRefresh(!isRefresh);
    setCurrentPerson(null);
  };

  const handleMakePersonOverseer = async () => {
    handleCloseMenu();
    const currentFSG = FSGList.get(currentList);
    await currentFSG.makePersonOverseer(group.group_uid, currentPerson);
    setIsRefresh(!isRefresh);
    setCurrentPerson(null);
  };

  const handleMakePersonAssistant = async () => {
    handleCloseMenu();
    const currentFSG = FSGList.get(currentList);
    await currentFSG.makePersonAssistant(group.group_uid, currentPerson);
    setIsRefresh(!isRefresh);
    setCurrentPerson(null);
  };

  const handleRemovePersonOverseer = async () => {
    handleCloseMenu();
    const currentFSG = FSGList.get(currentList);
    await currentFSG.removePersonOverseer(group.group_uid, currentPerson);
    setIsRefresh(!isRefresh);
    setCurrentPerson(null);
  };

  const handleRemovePersonAssistant = async () => {
    handleCloseMenu();
    const currentFSG = FSGList.get(currentList);
    await currentFSG.removePersonAssistant(group.group_uid, currentPerson);
    setIsRefresh(!isRefresh);
    setCurrentPerson(null);
  };

  const handleMovePersonToGroup = async (event) => {
    handleCloseMenu();
    const groupElement = event.currentTarget;
    const groupDest = groupElement.dataset.group_uid;

    const currentFSG = FSGList.get(currentList);
    await currentFSG.movePersonToGroup(group.group_uid, groupDest, currentPerson);
    setIsRefresh(!isRefresh);
    setCurrentPerson(null);
  };

  const handleMoveGroupForward = async () => {
    handleCloseMenu();
    const currentFSG = FSGList.get(currentList);
    await currentFSG.moveGroupForward(group.group_uid);
    setIsRefresh(!isRefresh);
  };

  const handleMoveGroupBackward = async () => {
    handleCloseMenu();
    const currentFSG = FSGList.get(currentList);
    await currentFSG.moveGroupBackward(group.group_uid);
    setIsRefresh(!isRefresh);
  };

  useEffect(() => {
    setIsLoading(true);
    const listWithName = group.persons.map((person) => {
      const original = Persons.get(person.person_uid);
      const isAppointed = original.spiritualStatus.find(
        (status) => (status.status === 'elder' || status.status === 'ms') && status.endDate === null
      );
      return {
        ...person,
        person_name: original.person_name,
        isMale: original.isMale,
        isFemale: original.isFemale,
        isAppointed: isAppointed ? true : false,
      };
    });

    let result = [];

    const overseer = listWithName.find((person) => person.isOverseer);
    if (overseer) result.push(overseer);

    const assistant = listWithName.find((person) => person.isAssistant);
    if (assistant) result.push(assistant);

    const publishers = listWithName.filter((person) => !person.isOverseer && !person.isAssistant);

    publishers.sort((a, b) => {
      return a.person_name > b.person_name ? 1 : -1;
    });

    result = [...result, ...publishers];

    setPersons(result);
    setIsLoading(false);
  }, [group.persons]);

  useEffect(() => {
    const currentFSG = FSGList.get(currentList);
    const usedOptions = [];

    for (const group of currentFSG.groups) {
      usedOptions.push(...group.persons);
    }

    const finalList = [];
    for (const person of Persons.filterAdvanced({ filter: 'allPublishers' })) {
      const findUsed = usedOptions.find((used) => used.person_uid === person.person_uid);
      if (!findUsed) finalList.push(person);
    }

    setOptions(finalList);
  }, [currentList, isRefresh]);

  return (
    <Paper elevation={8} sx={{ width: '350px' }}>
      <Box
        sx={{
          padding: '10px',
          backgroundColor: theme.fsgHeadingColor,
          borderRadius: '10px 10px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography textAlign="center" sx={{ color: 'white', fontSize: '20px', marginLeft: '10px' }}>
          {t('abbrFieldService', { index: group_index + 1, count: group.persons.length })}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {group_index > 0 && group_index <= FSGList.get(currentList).groups.length - 1 && (
            <IconButton aria-label="left" sx={{ color: 'white' }} onClick={handleMoveGroupBackward}>
              <ArrowCircleLeftIcon />
            </IconButton>
          )}

          {group_index >= 0 && group_index < FSGList.get(currentList).groups.length - 1 && (
            <IconButton aria-label="right" sx={{ color: 'white' }} onClick={handleMoveGroupForward}>
              <ArrowCircleRightIcon />
            </IconButton>
          )}

          <IconButton aria-label="delete" color="error" onClick={handleDeleteGroup}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          padding: '10px',
          overflow: 'auto',
          height: '380px',
          borderTop: 'none',
        }}
      >
        <Box sx={{ padding: '5px 5px 10px 5px', display: 'flex', flexDirection: 'column' }}>
          {isLoading && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '300px',
              }}
            >
              <CircularProgress color="secondary" size={40} disableShrink={true} />
            </Box>
          )}
          {!isLoading &&
            persons.map((person) => (
              <Box
                key={person.person_uid}
                sx={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Avatar sx={{ height: '20px', width: '20px' }} alt="Student icon" src={getPersonIcon(person)}>
                    {person.isOverseer && <GroupIcon color="primary" sx={{ fontSize: '15px' }} />}
                    {person.isAssistant && <GroupIcon color="secondary" sx={{ fontSize: '15px' }} />}
                  </Avatar>
                  <Typography data-person_uid={person.person_uid}>{person.person_name}</Typography>
                </Box>
                <IconButton
                  aria-label="person-more"
                  id="person-more-button"
                  aria-controls={openMenu ? 'person-more-menu' : undefined}
                  aria-expanded={openMenu ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleClickMenu}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
            ))}
          <Menu
            id="person-more-menu"
            anchorEl={anchorElMenu}
            open={openMenu}
            onClose={handleCloseMenu}
            MenuListProps={{
              'aria-labelledby': 'person-more-button',
            }}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <MenuItem onClick={handleRemovePersonToGroup}>
              <ListItemIcon>
                <PersonRemoveIcon color="error" sx={{ fontSize: '25px' }} />
              </ListItemIcon>
              <ListItemText>{t('removeFromGroup')}</ListItemText>
            </MenuItem>
            {!hasOverseer && isAppointed && !isOverseer && (
              <MenuItem onClick={handleMakePersonOverseer}>
                <ListItemIcon>
                  <VerifiedIcon color="primary" sx={{ fontSize: '25px' }} />
                </ListItemIcon>
                <ListItemText>{t('makeAsOverseer')}</ListItemText>
              </MenuItem>
            )}
            {isOverseer && (
              <MenuItem onClick={handleRemovePersonOverseer}>
                <ListItemIcon>
                  <VerifiedIcon color="primary" sx={{ fontSize: '25px' }} />
                </ListItemIcon>
                <ListItemText>{t('removeAsOverseer')}</ListItemText>
              </MenuItem>
            )}
            {!hasAssistant && isAppointed && !isOverseer && !isAssistant && (
              <MenuItem onClick={handleMakePersonAssistant}>
                <ListItemIcon>
                  <AssistantIcon color="secondary" sx={{ fontSize: '25px' }} />
                </ListItemIcon>
                <ListItemText>{t('makeAsAssistant')}</ListItemText>
              </MenuItem>
            )}
            {isAssistant && (
              <MenuItem onClick={handleRemovePersonAssistant}>
                <ListItemIcon>
                  <AssistantIcon color="secondary" sx={{ fontSize: '25px' }} />
                </ListItemIcon>
                <ListItemText>{t('removeAsAssistant')}</ListItemText>
              </MenuItem>
            )}
            {finalGroups.map((groupInfo) => (
              <MenuItem key={groupInfo.index} data-group_uid={groupInfo.group_uid} onClick={handleMovePersonToGroup}>
                <ListItemIcon>
                  <InputIcon sx={{ fontSize: '25px' }} />
                </ListItemIcon>
                <ListItemText>{t('moveToFieldServiceGroup', { index: groupInfo.index })}</ListItemText>
              </MenuItem>
            ))}
          </Menu>
        </Box>
        {options.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Autocomplete
              disablePortal
              id="combo-box-persons"
              size="small"
              noOptionsText={t('noOptions')}
              options={options}
              getOptionLabel={(option) => option.person_name}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} />}
              value={selected}
              onChange={(e, newValue) => {
                setSelected(newValue);
              }}
            />
            <IconButton aria-label="add" color="success" onClick={handleAddPersonToGroup}>
              <AddCircleIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default FieldServiceGroupItem;
