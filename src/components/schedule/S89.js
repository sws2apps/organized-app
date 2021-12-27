import { useEffect, useState } from "react";
import { PDFDocument, TextAlignment } from 'pdf-lib';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Typography from "@mui/material/Typography";
import WarningIcon from '@mui/icons-material/Warning';
import { dbGetS89ItemData, dbGetS89WeekList } from "../../indexedDb/dbAssignment";
import pdfS89 from '../../template/S-89_MG.pdf';
import TreeViewCheckbox from "../reusable/TreeViewCheckbox";

const S89 = (props) => {
    const [currentSchedule, setCurrentSchedule] = useState("");
    const [data, setData] = useState({});
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createPDF, setCreatePDF] = useState(false);
    const [disablePDF, setDisablePDF] = useState(false);
    const [pdfData64, setPdfData64] = useState(null);

    useEffect(() => {
        if (props.currentSchedule !== "") {
            setCurrentSchedule(props.currentSchedule);
        }
    }, [props.currentSchedule])

    useEffect(() => {
        const getDataS89 = async () => {
            const data = await dbGetS89WeekList(currentSchedule);
            setData(data);
            setLoading(false);
        }
        if (currentSchedule !== "") {
            getDataS89();
        }
    }, [currentSchedule])

    const handleGeneratePDF = async () => {
        const realData = selected.filter(item => item.length > 10);
        realData.sort((a, b) => {
            return a > b ? 1 : -1;
        });

        setCreatePDF(true);
        setPdfData64(null);

        const s89PdfBytes = await fetch(pdfS89).then(res => res.arrayBuffer());
        const s89Doc = await PDFDocument.create();
        
        for(let i = 0; i < realData.length; i++) {
            const week = realData[i].split("-")[0];
            const assType = realData[i].split("@")[1].split("-")[0];
            const classLabel = realData[i].split("-")[2];

            const data = await dbGetS89ItemData(week, assType, classLabel);

            const pdfDoc = await PDFDocument.load(s89PdfBytes);
            const form = pdfDoc.getForm();
            // PDFTextField: 900_1_Text - Student
            const mainStuField = form.getTextField("900_1_Text");
            mainStuField.setText(data.studentName);
            mainStuField.setFontSize(9);
            // PDFTextField: 900_2_Text - Assistant
            const assistantField = form.getTextField("900_2_Text");
            assistantField.setText(data.assistantName);
            assistantField.setFontSize(9);
            // PDFTextField: 900_3_Text - Date
            const dateAssignment = form.getTextField("900_3_Text");
            dateAssignment.setText(data.assignmentDate);
            dateAssignment.setFontSize(10);
            dateAssignment.setAlignment(TextAlignment.Center);
            // PDFCheckBox: 900_4_CheckBox - Bible Reading
            if (data.isBRead === true) {
                const checkBRead = form.getCheckBox("900_4_CheckBox");
                checkBRead.check();
            }
            // PDFCheckBox: 900_5_CheckBox - Initial Call
            if (data.isInitialCall === true) {
                const checkIniCall = form.getCheckBox("900_5_CheckBox");
                checkIniCall.check();
            }
            // PDFTextField: 900_6_Text - Initial Call indice
            const iniCallSpec = form.getTextField("900_6_Text");
            iniCallSpec.setText(data.initialCallSpec);
            iniCallSpec.setFontSize(8);
            // PDFCheckBox: 900_7_CheckBox - RV
            if (data.isReturnVisit === true) {
                const checkRV = form.getCheckBox("900_7_CheckBox");
                checkRV.check();
            }
            // PDFTextField: 900_8_Text - RV indice
            const rvSpec = form.getTextField("900_8_Text");
            rvSpec.setText(data.returnVisitSpec);
            rvSpec.setFontSize(8);
            // PDFCheckBox: 900_9_CheckBox - Bible Study
            if (data.isBibleStudy === true) {
                const checkBS = form.getCheckBox("900_9_CheckBox");
                checkBS.check();
            }
            // PDFCheckBox: 900_10_CheckBox - Talk
            if (data.isTalk === true) {
                const checkTalk = form.getCheckBox("900_10_CheckBox");
                checkTalk.check();
            }
            // PDFCheckBox: 900_11_CheckBox - Other
            // PDFTextField: 900_12_Text - Other indice
            // PDFCheckBox: 900_13_CheckBox - Main Hall
            if (data.isMainHall === true) {
                const checkMainHall = form.getCheckBox("900_13_CheckBox");
                checkMainHall.check();
            }
            // PDFCheckBox: 900_14_CheckBox - Aux Class 1
            if (data.isAuxClass === true) {
                const checkAuxClass = form.getCheckBox("900_14_CheckBox");
                checkAuxClass.check();
            }
            // PDFCheckBox: 900_15_CheckBox - Aux Class 2
            
            form.flatten();
            await pdfDoc.save();
            const [temp] = await s89Doc.copyPages(pdfDoc, [0]);
            await s89Doc.addPage(temp);            
            await s89Doc.save(); 
        }
        const pdfUri = await s89Doc.saveAsBase64({ dataUri: true });
        setCreatePDF(false);
        setPdfData64(pdfUri); 
    };

    const handleDownloadS89 = () => {
        const a = document.createElement('a');
        a.href = pdfData64;
        a.download = "S89.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    useEffect(() => {
        setPdfData64(null);
        const realData = selected.filter(item => item.length > 10);
        if (realData.length === 0) {
            setDisablePDF(true);
        } else {
            setDisablePDF(false);
        }
    }, [selected])

    return ( 
        <Box sx={{minWidth: 320}}>
            {loading && (
                <CircularProgress
                    color="secondary"
                    size={60}
                    disableShrink={true}
                    sx={{
                        display: 'flex',
                        margin: '10px auto',
                    }}
                />
            )}
            {!loading && (
                <>
                    {Object.keys(data).length > 2 && (
                        <>
                            {data.children.length > 0 && (
                                <>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            startIcon={<PlayArrowIcon />}
                                            disabled={disablePDF}
                                            onClick={() => handleGeneratePDF()}
                                            sx={{marginRight: '10px'}}
                                        >
                                            PDF
                                        </Button>
                                        {createPDF && (
                                            <CircularProgress
                                                color="secondary"
                                                size={30}
                                                disableShrink={true}
                                            />
                                        )}
                                        {pdfData64 !== null && (
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                startIcon={<PictureAsPdfIcon />}
                                                onClick={() => handleDownloadS89()}
                                            >
                                                Haka PDF
                                            </Button>
                                        )}
                                    </Box>
                                    <TreeViewCheckbox
                                        data={data}
                                        selected={selected}
                                        setSelected={(value) => setSelected(value)}
                                        defaultExpanded={["S89"]}
                                    />
                                </>
                            )}
                            {data.children.length === 0 && (
                                <Container
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '20vh',
                                    }}
                                >
                                    <WarningIcon color="error" sx={{fontSize: '60px'}} />
                                    <Typography variant="body1" align="center">
                                        Tsy misy anjara azo atao pirinty ao amin’io fandaharana io
                                    </Typography>
                                </Container>
                            )}
                        </>
                    )}
                </>
            )}
        </Box>
     );
}

export default S89;