import { fileDialog } from 'file-select-dialog';
import { Redirect } from 'react-router-dom';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import WeekList from '../components/sourceMaterial/WeekList';
import WeekDetails from '../components/sourceMaterial/WeekDetails';
import { dbAddManualSource, dbSaveSrcData } from '../indexedDb/dbSourceMaterial';
import { epubFileState } from '../appStates/appSourceMaterial';

const SourceMaterial = (props) => {
    const [isImport, setIsImport] = useState(false);
    const [currentWeek, setCurrentWeek] = useState("");
    const [isRender, setIsRender] = useState(false);

    const setEpubFile = useSetRecoilState(epubFileState);

    const handleWeekAdd = async () => {
        await dbAddManualSource();
        props.setAppSnackOpen(true);
        props.setAppSeverity("success");
        props.setAppMessage("Tafiditra ny herinandro vaovao");
        setIsRender(true);
    }

    const handleImportEPUB = async () => {
        const file = await fileDialog({
            accept: '.epub',
            strict: true
        });
        setEpubFile(file);
        setIsImport(true);
    }

    const handleSaveSource = async (data) => {
        const isSaved = await dbSaveSrcData(data);
        if (isSaved === true) {
            props.setAppSnackOpen(true);
            props.setAppSeverity("success");
            props.setAppMessage("Vita ny fitehirizana ny loharanon-kevitra");
        } else {
            props.setAppSnackOpen(true);
            props.setAppSeverity("error");
            props.setAppMessage("Nisy olana ka tsy voatahiry ny fanovana nataonao.");
        }

    }

    if (isImport === true) {
        return <Redirect to={{
            pathname: '/ImportEPUB',
        }}/>
    }

    return ( 
        <Box
            sx={{
                marginRight: '5px',
                marginTop: '10px',
            }}
        >
            <WeekList setCurrentWeek={(value) => setCurrentWeek(value)} isRender={isRender} />
            {currentWeek !== "" && (
                <WeekDetails
                    currentWeek={currentWeek}
                    handleWeekAdd={handleWeekAdd}
                    handleImportEPUB={handleImportEPUB}
                    handleSaveSource={handleSaveSource}
                /> 
            )}                
        </Box>
     );
}
 
export default SourceMaterial;