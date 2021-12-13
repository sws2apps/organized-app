import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const AppDrawer = () => {
    return ( 
        <div>
            <List>
                <ListItem button component={Link} to="/">
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary={"Fandraisana"} />
                </ListItem>
                <ListItem button component={Link} to="/Students">
                    <ListItemIcon><PeopleIcon /></ListItemIcon>
                    <ListItemText primary={"Mpianatra"} />
                </ListItem>
                <ListItem button component={Link} to="/Schedule">
                    <ListItemIcon><ScheduleIcon /></ListItemIcon>
                    <ListItemText primary={"Fandaharana"} />
                </ListItem>
                <ListItem button component={Link} to="/SourceMaterial">
                    <ListItemIcon><LibraryBooksIcon /></ListItemIcon>
                    <ListItemText primary={"Loharanon-kevitra"} />
                </ListItem>
                <ListItem button component={Link} to="/Settings">
                    <ListItemIcon><SettingsIcon /></ListItemIcon>
                    <ListItemText primary={"Fanamboarana"} />
                </ListItem>
                <ListItem button component={Link} to="/Help">
                    <ListItemIcon><HelpIcon /></ListItemIcon>
                    <ListItemText primary={"Fanampiana"} />
                </ListItem>
            </List>
        </div>
    );
}
 
export default AppDrawer;