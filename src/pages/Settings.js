import { useState } from "react";
import { Redirect } from "react-router-dom";
import Box from '@mui/material/Box';
import BasicSettings from "../components/settings/BasicSettings";
import DataStorage from "../components/settings/DataStorage";
import UseInternet from "../components/settings/UseInternet";

const sharedStyles = {
    settingItem: {
        flex: "1 1 350px",
        borderRadius: '10px',
        margin: "10px 2px",
        padding: '5px',
    },
}

const Settings = (props) => {
    const [isRedirect, setIsRedirect] = useState(false);
    const [jsonFile, setJsonFile] = useState("");

    if (isRedirect === true) {
        return <Redirect to={{
            pathname: '/DBRestore',
            state: { jsonFile: jsonFile}
        }}/>
    }

    return ( 
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                marginRight: '5px',
            }}
        >
            <Box sx={sharedStyles.settingItem}>
                <BasicSettings 
                    setAppSnackOpen={(value) => props.setAppSnackOpen(value)}
                    setAppSeverity={(value) => props.setAppSeverity(value)}
                    setAppMessage={(value) => props.setAppMessage(value)}
                />
            </Box>
            <Box sx={sharedStyles.settingItem}>
                <UseInternet
                    setAppSnackOpen={(value) => props.setAppSnackOpen(value)}
                    setAppSeverity={(value) => props.setAppSeverity(value)}
                    setAppMessage={(value) => props.setAppMessage(value)}
                />
            </Box>
            <Box sx={sharedStyles.settingItem}>
                <DataStorage
                    setIsRedirect={(value) => setIsRedirect(value)}
                    setJsonFile={(value) => setJsonFile(value)}
                    setAppSnackOpen={(value) => props.setAppSnackOpen(value)}
                    setAppSeverity={(value) => props.setAppSeverity(value)}
                    setAppMessage={(value) => props.setAppMessage(value)}
                />
            </Box>
        </Box>
     );
}
 
export default Settings;