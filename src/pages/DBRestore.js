import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Container from '@mui/material/Container';
import ErrorIcon from '@mui/icons-material/Error';
import Typography from '@mui/material/Typography';
import { dbRestoreDb, isValidJSON } from "../indexedDb/dbUtility";

const sharedStyles = {
    jsonLoad: {
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

const DBRestore = (props) => {
    const [isValid, setIsValid] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    var fileJSON = "";
    if (props.location.state !== undefined) {
        fileJSON = props.location.state.jsonFile;
    }

    useEffect(() => {
        const validateJSON = async () => {
            if (fileJSON.type === "application/json") {
                const isValid = await isValidJSON(fileJSON);
                if (isValid === true) {
                    setIsValid(true);
                } else {
                    setIsValid(false);
                }
            } else if (fileJSON.type === "text/json") {
                setIsValid(true);
            } else {
                setIsValid(false);
            }
            setIsLoading(false);
        };
        validateJSON();
    }, [fileJSON])

    useEffect(() => {
        const loadJSON = async () => {
            await dbRestoreDb(fileJSON);
            setIsComplete(true);
            setTimeout(() => {
                window.location.href = './';
            }, 2000);
        }

        if (isValid === true) {
            loadJSON();
        };
    }, [fileJSON, isValid])

    if (fileJSON === "") {
        return <Redirect to={{
            pathname: '/Settings',
        }}/>
    }

    return ( 
        <div>
            {(!isLoading && !isValid) && (
                <Container sx={sharedStyles.jsonLoad}>
                    <ErrorIcon color="error" sx={{fontSize: '150px'}} />
                    <Typography variant="body1" align="center">
                        Tsy rakitra misy ny fitehirizana momba ny LMM-OA io nosafidianao io, fa hamarino indray mandeha.
                    </Typography>
                </Container>
            )}
            {(!isLoading && isValid) && (
                <Container sx={sharedStyles.jsonLoad}>
                    {!isComplete && (
                        <>
                            <CircularProgress color="secondary" size={'70px'} />
                            <Typography variant="body1" align="center" sx={sharedStyles.textCircular}>
                                Miandrasa kely ...
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
                                Vita ny famerenana ny rakitra fiandry ho an’ny LMM-OA.
                            </Typography>
                        </>
                    )}
                </Container>
            )}
        </div>
     );
}
 
export default DBRestore;