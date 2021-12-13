import { useEffect, useState } from 'react';
import { Redirect } from "react-router-dom";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Typography from '@mui/material/Typography';
import { dbGetScheduleForPrint } from '../indexedDb/dbAssignment';
import { dbGetAppSettings } from '../indexedDb/dbAppSettings';

const ScheduleTemplate = (props) => {
    const [data, setData] = useState([]);
    const [classCount, setClassCount]= useState(1);
    const [congName, setCongName] = useState("");
    const [congNumber, setCongNumber] = useState("");

    let currentSchedule;
    if (props.location.state !== undefined) {
        currentSchedule = props.location.state.currentSchedule;
    };

    const savePDF = () => {
        var html2pdf = require("html2pdf.js")
        const element = document.getElementById("schedule_template");
        var opt = {
            margin: [0.2, 0.5, 0.2, 0.5],
            filename: 'Anjara_Mpianatra.pdf',
            image: { type: 'jpeg', quality: 0.5 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
          };
        html2pdf().set(opt).from(element).save();
    }

    useEffect(() => {
        const getData = async () => {
            const data = await dbGetScheduleForPrint(currentSchedule);
            setData(data);
        }
        getData();
    }, [currentSchedule])

    const loadSettings = async () => {
        const appSettings = await dbGetAppSettings();
        setClassCount(appSettings.class_count);
        setCongName(appSettings.cong_name);
        setCongNumber(appSettings.cong_number);
    };
    loadSettings();

    if (props.location.state === undefined) {
        return <Redirect to={{
            pathname: '/Schedule',
        }}/>
    }

    return ( 
        <>
            {data.length > 0 && (
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveAltIcon />}
                        sx={{margin: '0 2px 2px 0'}}
                        onClick={savePDF}
                    >
                        PDF
                    </Button>
                    <Box
                        sx={{
                            width: '800px',
                            overflow: 'auto',
                        }}
                    >
                        <Box
                            id="schedule_template"
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-end',
                                    borderBottom: '3px solid black',
                                    paddingBottom: '2px',
                                    marginBottom: '20px',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        fontSize: '13px',
                                        color: 'black',
                                    }}
                                >
                                    {congName !== "" && congNumber !== "" ? `${congName.toUpperCase()} (${congNumber.toUpperCase()})`: ''}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        fontSize: '19px',
                                        color: 'black',
                                    }}
                                >
                                    Anjaran’ny mpianatra
                                </Typography>
                            </Box>
                            {data.map(weekItem => {
                                const month = weekItem.week.split("/")[0];
                                var monthName = "";
                    
                                if (month === "01") {
                                    monthName = "Janoary"
                                } else if (month === "02") {
                                    monthName = "Febroary"
                                } else if (month === "03") {
                                    monthName = "Martsa"
                                } else if (month === "04") {
                                    monthName = "Aprily"
                                } else if (month === "05") {
                                    monthName = "Mey"
                                } else if (month === "06") {
                                    monthName = "Jona"
                                } else if (month === "07") {
                                    monthName = "Jolay"
                                } else if (month === "08") {
                                    monthName = "Aogositra"
                                } else if (month === "09") {
                                    monthName = "Septambra"
                                } else if (month === "10") {
                                    monthName = "Oktobra"
                                } else if (month === "11") {
                                    monthName = "Novambra"
                                } else if (month === "12") {
                                    monthName = "Desambra"
                                }

                                const dateV = weekItem.week.split("/")[1] + " " + monthName.toUpperCase();

                                return (
                                    <Box key={weekItem.week} sx={{marginBottom: '15px'}}>
                                        <Typography
                                            sx={{
                                                fontWeight: 'bold',
                                                fontSize: '13px',
                                                color: 'black',
                                                marginBottom: '5px',
                                            }}
                                        >
                                            {dateV}
                                        </Typography>
                                        {weekItem.scheduleData.noMeeting && (
                                            <Typography
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: 'darkblue',
                                                    fontSize: '13px',
                                                    width: '360px',
                                                    lineHeight: '20px',
                                                }}
                                            >
                                                Tsy misy fivoriana
                                            </Typography>
                                        )}
                                        {weekItem.scheduleData.week_type !== 1 && (
                                            <Typography
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: 'darkblue',
                                                    fontSize: '13px',
                                                    width: '360px',
                                                    lineHeight: '20px',
                                                    marginBottom: '5px',
                                                }}
                                            >
                                                {weekItem.scheduleData.week_type_name.toUpperCase()}
                                            </Typography>
                                        )}
                                        {(!weekItem.scheduleData.noMeeting && weekItem.scheduleData.week_type !== 3) && (
                                            <>
                                                <Box sx={{ display: 'flex' }} >
                                                    <Typography
                                                        sx={{
                                                            color: 'white',
                                                            fontWeight: 'bold',
                                                            fontSize: '12px',
                                                            padding: '0 0 0 6px',
                                                            backgroundColor: '#656164',
                                                            width: '360px',
                                                            lineHeight: '20px',
                                                        }}
                                                    >
                                                        HARENA AVY AO AMIN’NY TENIN’ANDRIAMANITRA
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            color: 'gray',
                                                            fontSize: '9px',
                                                            fontWeight: 'bold',
                                                            padding: '0 0 0 8px',
                                                            width: '180px',
                                                            lineHeight: '20px',
                                                        }}
                                                    >
                                                        {classCount === 1 ? '' : 'Efitrano faharoa'}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            color: 'gray',
                                                            fontSize: '9px',
                                                            fontWeight: 'bold',
                                                            padding: '0 0 0 8px',
                                                            width: '180px',
                                                            lineHeight: '20px',
                                                        }}
                                                    >
                                                        Efitrano Lehibe
                                                    </Typography>
                                                </Box>
                                                <Box 
                                                    sx={{
                                                        display: 'flex',
                                                        marginBottom: '5px',
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: '360px',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                lineHeight: '20px',
                                                            }}
                                                        >
                                                            <ul className="ulSchedule">
                                                                <li className="tgw">
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: '13px',
                                                                            color: 'black',
                                                                            lineHeight: 1.2,
                                                                        }}
                                                                    >
                                                                        Famakiana Baiboly<span className="student-part-duration">(4 min. na latsaka)</span>
                                                                    </Typography>
                                                                </li>
                                                            </ul>
                                                        </Box>
                                                        <Typography
                                                            sx={{
                                                                color: 'gray',
                                                                fontSize: '9px',
                                                                fontWeight: 'bold',
                                                                padding: '0 0 0 8px',
                                                                lineHeight: '20px',
                                                            }}
                                                        >
                                                            Mpianatra:
                                                        </Typography>
                                                    </Box>
                                                    <Typography
                                                        sx={{
                                                            color: 'black',
                                                            fontSize: '13px',
                                                            padding: '0 0 0 8px',
                                                            width: '180px',
                                                            lineHeight: '20px',
                                                        }}
                                                    >
                                                        {classCount === 1 ? '' : weekItem.scheduleData.bRead_stu_B_dispName}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            color: 'black',
                                                            fontSize: '13px',
                                                            padding: '0 0 0 8px',
                                                            width: '180px',
                                                            lineHeight: '20px',
                                                        }}
                                                    >
                                                        {weekItem.scheduleData.bRead_stu_A_dispName}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex' }} >
                                                    <Typography
                                                        sx={{
                                                            color: 'white',
                                                            fontWeight: 'bold',
                                                            fontSize: '12px',
                                                            padding: '0 0 0 6px',
                                                            backgroundColor: '#a56803',
                                                            width: '360px',
                                                            lineHeight: '20px',
                                                        }}
                                                    >
                                                        FAMPIOFANANA AMIN’NY FANOMPOANA
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            color: 'gray',
                                                            fontSize: '9px',
                                                            fontWeight: 'bold',
                                                            padding: '0 0 0 8px',
                                                            width: '180px',
                                                            lineHeight: '20px',
                                                        }}
                                                    >
                                                        {classCount === 1 ? '' : 'Efitrano faharoa'}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            color: 'gray',
                                                            fontSize: '9px',
                                                            fontWeight: 'bold',
                                                            padding: '0 0 0 8px',
                                                            width: '180px',
                                                            lineHeight: '20px',
                                                        }}
                                                    >
                                                        Efitrano Lehibe
                                                    </Typography>
                                                </Box>
                                                {[1, 2, 3, 4].map(index => {
                                                    const fldTypeName = "ass" + index + "_type_name";
                                                    const fldType = "ass" + index + "_type";
                                                    const fldTime = "ass" + index + "_time";
                                                    const fldSrc = "ass" + index + "_src";
                                                    const fldStuA = "ass" + index + "_stu_A_dispName";
                                                    const fldAssA = "ass" + index + "_ass_A_dispName";
                                                    const fldStuB = "ass" + index + "_stu_B_dispName";
                                                    const fldAssB = "ass" + index + "_ass_B_dispName";

                                                    return (
                                                        <>
                                                            {weekItem.sourceData[fldType] !== "" && (
                                                                <Box 
                                                                    key={index}
                                                                    sx={{
                                                                        display: 'flex',
                                                                        marginBottom: '2px',
                                                                    }}
                                                                >
                                                                    <Box
                                                                        sx={{
                                                                            width: '360px',
                                                                            display: 'flex',
                                                                            justifyContent: 'space-between',
                                                                        }}
                                                                    >
                                                                        <Box
                                                                            sx={{
                                                                                lineHeight: '20px',
                                                                            }}
                                                                        >
                                                                            <ul className="ulSchedule">
                                                                                <li className="ayf">
                                                                                    <Typography
                                                                                        sx={{
                                                                                            fontSize: '13px',
                                                                                            color: 'black',
                                                                                            lineHeight: 1.3,
                                                                                        }}
                                                                                    >
                                                                                        {weekItem.sourceData[fldType] === 7 ? weekItem.sourceData[fldSrc].split(": (")[0] : weekItem.sourceData[fldTypeName]}
                                                                                        <span className="student-part-duration">
                                                                                            {(weekItem.sourceData[fldType] === 5 || weekItem.sourceData[fldType] === 6) && (
                                                                                                <>
                                                                                                    ({weekItem.sourceData[fldTime]} min.)
                                                                                                </>
                                                                                            )}
                                                                                            {(weekItem.sourceData[fldType] === 1 || weekItem.sourceData[fldType] === 2 || weekItem.sourceData[fldType] === 3 || weekItem.sourceData[fldType] === 4) && (
                                                                                                <>
                                                                                                    ({weekItem.sourceData[fldTime]} min. na latsaka)
                                                                                                </>
                                                                                            )}
                                                                                            {(weekItem.sourceData[fldType] === 7) && (
                                                                                                <>
                                                                                                    ({weekItem.sourceData[fldSrc].split(": (")[1].split(" ")[0]} min.)
                                                                                                </>
                                                                                            )}
                                                                                        </span>
                                                                                    </Typography>
                                                                                </li>
                                                                            </ul>
                                                                        </Box>
                                                                        {(weekItem.sourceData[fldType] === 1 || weekItem.sourceData[fldType] === 2 || weekItem.sourceData[fldType] === 3) && (
                                                                            <Typography
                                                                                sx={{
                                                                                    color: 'gray',
                                                                                    fontSize: '9px',
                                                                                    fontWeight: 'bold',
                                                                                    padding: '0 0 0 8px',
                                                                                    lineHeight: '20px',
                                                                                }}
                                                                            >
                                                                                Mpianatra/Mpanampy:
                                                                            </Typography>
                                                                        )}
                                                                        {(weekItem.sourceData[fldType] === 4) && (
                                                                            <Typography
                                                                                sx={{
                                                                                    color: 'gray',
                                                                                    fontSize: '9px',
                                                                                    fontWeight: 'bold',
                                                                                    padding: '0 0 0 8px',
                                                                                    lineHeight: '20px',
                                                                                }}
                                                                            >
                                                                                Mpianatra:
                                                                            </Typography>
                                                                        )}
                                                                    </Box>
                                                                    <Typography
                                                                        sx={{
                                                                            color: 'black',
                                                                            fontSize: '12px',
                                                                            padding: '0 0 0 8px',
                                                                            width: '180px',
                                                                            lineHeight: '20px',
                                                                        }}
                                                                    >
                                                                        {classCount === 2 && (
                                                                            <>
                                                                                {(weekItem.sourceData[fldType] === 1 || weekItem.sourceData[fldType] === 2 || weekItem.sourceData[fldType] === 3 || weekItem.sourceData[fldType] === 4) && (
                                                                                    <>
                                                                                    {weekItem.scheduleData[fldStuB]}{weekItem.scheduleData[fldAssB] === '' ? '' : `/${weekItem.scheduleData[fldAssB]}`}
                                                                                    </>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </Typography>
                                                                    <Typography
                                                                        sx={{
                                                                            color: 'black',
                                                                            fontSize: '12px',
                                                                            padding: '0 0 0 8px',
                                                                            width: '180px',
                                                                            lineHeight: '20px',
                                                                        }}
                                                                    >
                                                                        <>
                                                                            {(weekItem.sourceData[fldType] === 1 || weekItem.sourceData[fldType] === 2 || weekItem.sourceData[fldType] === 3 || weekItem.sourceData[fldType] === 4) && (
                                                                                <>
                                                                                {weekItem.scheduleData[fldStuA]}{weekItem.scheduleData[fldAssA] === '' ? '' : `/${weekItem.scheduleData[fldAssA]}`}
                                                                                </>
                                                                            )}
                                                                        </>
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                        </>
                                                    );
                                                })}
                                            </>
                                        )}
                                    </Box>
                                )
                            })}
                        </Box>
                    </Box>
                </Box>
            )}
        </>
    );
}
 
export default ScheduleTemplate;