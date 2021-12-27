import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from 'recoil';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Container from '@mui/material/Container';
import ErrorIcon from '@mui/icons-material/Error';
import Typography from '@mui/material/Typography';
import { addEpubDataToDb } from "../epub/epubParser";
import { epubFileState } from '../appStates/appSourceMaterial';

const sharedStyles = {
    epubLoad: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70vh',
    },
    textCircular: {
        marginTop: '10px',
    },
};

const ImportEPUB = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isComplete, setIsComplete] = useState(false);
    const [isValid, setIsValid ] = useState(true);
    let history = useHistory();

    const fileEPUB = useRecoilValue(epubFileState);

    useEffect(() => {
        const loadEPUB = async () => {
            setIsLoading(false);
            const result = await addEpubDataToDb(fileEPUB);
            if (result === "error") {
                setIsValid(false);
            } else {
                setIsComplete(true);
                setTimeout(() => {
                    history.push('/SourceMaterial');
                }, 2000);
            }
        }

        if (fileEPUB !== "") {
            loadEPUB();
        };
        
        return (() => {
            //clean
        })
    }, [fileEPUB, history])

    if (fileEPUB === "") {
        history.push('/SourceMaterial');
    }

    return ( 
        <div>
            {(!isLoading && !isValid) && (
                <Container sx={sharedStyles.epubLoad}>
                    <ErrorIcon color="error" sx={{fontSize: '150px'}} />
                    <Typography variant="body1" align="center">
                        Tsy rakitra EPUB misy ny <em>Tari-dalana ho An’ny Fivoriana</em> io nosafidianao io, fa hamarino indray mandeha.
                    </Typography>
                </Container>
            )}
            {(!isLoading && isValid) && (
                <Container sx={sharedStyles.epubLoad}>
                    {!isComplete && (
                        <>
                            <CircularProgress color="secondary" size={'70px'} />
                            <Typography variant="body1" align="center" sx={sharedStyles.textCircular}>
                                Mampiditra ny rakitra EPUB. Miandrasa kely ...
                            </Typography>
                        </>
                    )}
                    {isComplete && (
                        <>
                            <CheckCircleIcon
                                color="success"
                                sx={{fontSize: '100px'}}
                            />
                            <Typography variant="body1" align="center" sx={sharedStyles.textCircular}>
                                Vita ny fampidirana ny loharanon-kevitra
                            </Typography>
                        </>
                    )}
                </Container>
            )}
        </div>
     );
}
 
export default ImportEPUB;