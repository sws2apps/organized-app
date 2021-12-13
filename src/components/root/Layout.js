import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import About from './About';
import AppMenus from './AppMenus';
import { isAboutOpenState } from '../../appStates/appSettings';

const Layout = (props) => {
    const { enabledInstall, isLoading, installPwa } = props;

    const isOpenAbout = useRecoilValue(isAboutOpenState);

    return ( 
        <Box sx={{display: 'flex'}}>
            {isOpenAbout && (
                <About />
            )}
            <AppMenus 
                enabledInstall={enabledInstall}
                isLoading={isLoading}
                installPwa={installPwa}
            />
            <Box
                sx={{
                    flexGrow: 1,
                    paddingTop: '60px',
                    paddingLeft: '5px',
                }}
            >
                {props.children}
            </Box>
        </Box>
     );
}
 
export default Layout;