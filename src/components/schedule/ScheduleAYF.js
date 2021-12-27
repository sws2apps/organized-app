import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { styled } from '@mui/styles';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

const TypoStudentPart = styled(Typography)(() => ({
    fontWeight: 'bold',
    fontSize: '16px',
}));

const BoxStudentAYF = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '8px',
}));

const TypoStudentField = styled(Typography)(() => ({
    height: '25px',
    lineHeight: '25px',
    width: '165px',
    backgroundColor: 'lightblue',
    color: 'purple',
    padding: '2px 2px 2px 5px',
    borderRadius: 5,
    fontWeight: 'bold',
}));

const BoxStudentFldContainer = styled(Box)(() => ({
    display: 'flex',
    marginRight: '5px',
    alignItems: 'flex-end',
}));

const IconButtonContainer = styled(IconButton)(() => ({
    padding: '1px',
}));

const EditIconButton = styled(EditIcon)(() => ({
    fontSize: '24px',
}));

const StudentAYF = (props) => {
    const [classCount, setClassCount]= useState(1);
    const [assType, setAssType] = useState("");
    const [assTypeName, setAssTypeName] = useState("");
    const [assTime, setAssTime] = useState("");
    const [assSrc, setAssSrc] = useState("");
    const [newAssSrc, setNewAssSrc] = useState("");
    const [stuA, setStuA] = useState("");
    const [assA, setAssA] = useState("");
    const [stuB, setStuB] = useState("");
    const [assB, setAssB] = useState("");
    const [stuAID, setStuAID] = useState(0);
    const [assAID, setAssAID] = useState(0);
    const [stuBID, setStuBID] = useState(0);
    const [assBID, setAssBID] = useState(0);
    const [isStuA, setIsStuA] = useState(false);
    const [isAssA, setIsAssA] = useState(false);
    const [isStuB, setIsStuB] = useState(false);
    const [isAssB, setIsAssB] = useState(false);

    const studentPartWrapper1Styles = {
        width: {
            xs: '100%',
            sm: 'calc(100% - 200px)',
        },
    }

    const studentPartWrapper2Styles = {
        width: {
            xs: '100%',
            sm: 'calc(100% - 200px)',
            sm800: 'calc(100% - 400px)',
            lg: 'calc(100% - 200px)',
        },
        flexDirection: {
            sm800: 'row',
        },
    }

    const studentContainer1Styles = {
        display: 'flex',
        justifyContent: {
            xs: 'flex-start',
            sm: 'flex-end',
        },
    }

    const studentContainer2Styles = {
        display: 'flex',
        justifyContent: {
            xs: 'flex-start',
            sm: 'flex-end',
        },
        flexDirection: {
            xs: 'column',
            xs420: 'row',
            sm: 'column',
            sm800: 'row',
            lg: 'column',
        }
    }

    const loadStudentPicker = (assID, assType, assTypeName, currentStudent, stuForAssistant, assTypeNameForAssistant) => {
        var obj = {};
        obj.assID = assID;
        obj.assType = assType;
        obj.assTypeName = assTypeName;
        obj.currentStudent = currentStudent;
        obj.stuForAssistant = stuForAssistant;
        obj.assTypeNameForAssistant = assTypeNameForAssistant;
        props.loadStudentPicker(obj)
    }

    useEffect(() => {
        setClassCount(props.params.classCount);
    }, [props.params.classCount])

    useEffect(() => {
        setAssType(props.params.assType);
    }, [props.params.assType])

    useEffect(() => {
        setAssTypeName(props.params.assTypeName);
    }, [props.params.assTypeName])

    useEffect(() => {
        setAssTime(props.params.assTime);
    }, [props.params.assTime])

    useEffect(() => {
        setNewAssSrc("");
        setAssSrc(props.params.assSrc);
    }, [props.params.assSrc])

    useEffect(() => {
        setStuA(props.params.stuA);
    }, [props.params.stuA])

    useEffect(() => {
        setAssA(props.params.assA);
    }, [props.params.assA])

    useEffect(() => {
        setStuB(props.params.stuB);
    }, [props.params.stuB])

    useEffect(() => {
        setAssB(props.params.assB);
    }, [props.params.assB])

    useEffect(() => {
        setStuAID(props.params.stuAID);
    }, [props.params.stuAID])

    useEffect(() => {
        setAssAID(props.params.assAID);
    }, [props.params.assAID])

    useEffect(() => {
        setStuBID(props.params.stuBID);
    }, [props.params.stuBID])

    useEffect(() => {
        setAssBID(props.params.assBID);
    }, [props.params.assBID])

    useEffect(() => {
        setIsStuA(props.params.isStuA);
    }, [props.params.isStuA])

    useEffect(() => {
        setIsAssA(props.params.isAssA);
    }, [props.params.isAssA])

    useEffect(() => {
        setIsStuB(props.params.isStuB);
    }, [props.params.isStuB])

    useEffect(() => {
        setIsAssB(props.params.isAssB);
    }, [props.params.isAssB])


    useEffect(() => {
        if (assType === 7 && assSrc) {
            const split = assSrc.split("min.)");
            const toFind = split[0] + "min.)";
            const replaceWith = "<strong>" + toFind + "</strong>";
            const newSrc = assSrc.replace(toFind, replaceWith);
            setNewAssSrc(parse(newSrc));
        }
    }, [assType, assSrc])

    return ( 
        <>
            {assSrc && (
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        marginBottom: '10px',
                    }}
                >
                    <Grid
                        item
                        sx={classCount === 1 ? studentPartWrapper1Styles : studentPartWrapper2Styles}
                     >
                        {assType !== 7 && (
                            <TypoStudentPart variant="body1">
                                {assTypeName} ({assTime} min.)
                            </TypoStudentPart>
                        )}
                        <Typography variant="body1">
                            {newAssSrc ? newAssSrc : assSrc}
                        </Typography>
                    </Grid>
                    {((assType !== 5) && (assType !== 6) && (assType !== 7)) && (
                        <Grid item sx={classCount === 1 ? studentContainer1Styles : studentContainer2Styles}>
                            <BoxStudentAYF>
                                <BoxStudentFldContainer>
                                    <TypoStudentField variant="body1">
                                        {stuA}
                                    </TypoStudentField>
                                    {isStuA && (
                                        <CircularProgress
                                            sx={{padding: '1px'}}
                                            color="secondary"
                                            size={26}
                                            disableShrink={true}
                                        />
                                    )}
                                    {!isStuA && (
                                        <IconButtonContainer
                                            onClick={() => loadStudentPicker(stuAID, assType, assTypeName, stuA)}
                                        >
                                            <EditIconButton />
                                        </IconButtonContainer>  
                                    )}               
                                </BoxStudentFldContainer>
                                {assType !== 4 && (
                                    <BoxStudentFldContainer>
                                        <TypoStudentField variant="body1">
                                            {assA}
                                        </TypoStudentField>
                                        {isAssA && (
                                            <CircularProgress
                                                sx={{padding: '1px'}}
                                                color="secondary"
                                                size={26}
                                                disableShrink={true}
                                            />
                                        )}
                                        {!isAssA && (
                                            <IconButtonContainer
                                                onClick={() => loadStudentPicker(assAID, assType, "Mpanampy", assA, stuA, assTypeName)}
                                            >
                                                <EditIconButton />
                                            </IconButtonContainer>
                                        )}
                                    </BoxStudentFldContainer>
                                )}
                            </BoxStudentAYF>
                            {classCount === 2 && (
                                <BoxStudentAYF>
                                    <BoxStudentFldContainer>
                                        <TypoStudentField variant="body1">
                                            {stuB}
                                        </TypoStudentField>
                                        {isStuB && (
                                            <CircularProgress
                                                sx={{padding: '1px'}}
                                                color="secondary"
                                                size={26}
                                                disableShrink={true}
                                            />
                                        )}
                                        {!isStuB && (
                                            <IconButtonContainer
                                                onClick={() => loadStudentPicker(stuBID, assType, assTypeName, stuB)}
                                            >
                                                <EditIconButton />
                                            </IconButtonContainer>
                                        )}
                                    </BoxStudentFldContainer>
                                    {assType !== 4 && (
                                        <BoxStudentFldContainer>
                                            <TypoStudentField variant="body1">
                                                {assB}
                                            </TypoStudentField>
                                            {isAssB && (
                                                <CircularProgress
                                                    sx={{padding: '1px'}}
                                                    color="secondary"
                                                    size={26}
                                                    disableShrink={true}
                                                />
                                            )}
                                            {!isAssB && (
                                                <IconButtonContainer
                                                    onClick={() => loadStudentPicker(assBID, assType, "Mpanampy", assB, stuB, assTypeName)}
                                                >
                                                    <EditIconButton />
                                                </IconButtonContainer>  
                                            )}               
                                        </BoxStudentFldContainer>
                                    )}
                                </BoxStudentAYF>
                            )}                        
                        </Grid>
                    )}
                </Box>
            )}
        </>
     );
}
 
export default StudentAYF;