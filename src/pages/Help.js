import { styled } from '@mui/styles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import HelpBrowserSupport from '../components/helpContent/HelpBrowserSupport';
import HelpUpdateSource from '../components/helpContent/HelpUpdateSource';
import HelpLiveClass from '../components/helpContent/HelpLiveClass';
import HelpNoInternet from '../components/helpContent/HelpNoInternet';
import HelpInstallPwa from '../components/helpContent/HelpInstallPwa';
import HelpStudentsAccessInternet from '../components/helpContent/HelpStudentsAccessInternet';

const sharedStyles = {
    heading: {
        fontWeight: 'bold',
    },
};

const AccordingFaqItem = styled(Accordion)(() => ({
    marginBottom: '10px',
}));

const TypographyFaqSubheading = styled(Typography)(() => ({
    marginBottom: '10px',
    fontWeight: 'bold',
    backgroundColor: '#2C3E50',
    color: 'white',
    padding: '5px',
    borderRadius: '10px',
}));

const Help = () => {
    return ( 
        <Box sx={{margin: '0 20px 0 15px'}}>
            <Typography
                variant="h6"
                color="primary"
                sx={{
                    lineHeight: '1.2',
                    marginBottom: '15px',
                }}
            >
                Life and Ministry Meeting - Overseer Assistant (LMM-OA)
            </Typography>
            <Typography
                variant="body1"
                sx={{marginBottom: '10px'}}
            >
                Programa natao hanampiana ny Mpiandraikitra ny Fivoriana Momba ny Fiainantsika sy ny Fanompoana ny LMM-OA, mba handaminana ny anjaran’ny mpianatra amin’ny fivoriana andavanandro. Hitanao eto ambany ny valin’ny fanontaniana samihafa rehefa mampiasa ity programa ity.
            </Typography>
            <TypographyFaqSubheading>MOMBAMOMBA ILAY PROGRAMA</TypographyFaqSubheading>
            <AccordingFaqItem>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography variant="body1" sx={sharedStyles.heading}>
                        Inona avy ny fitaovana fijerena internet azo ampiasana ny LMM-OA?
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <HelpBrowserSupport />
                </AccordionDetails>
            </AccordingFaqItem>
            <AccordingFaqItem>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography variant="body1" sx={sharedStyles.heading}>
                        Tsy maintsy manokatra programa fijerena internet ve vao afaka mampiasa ny LMM-OA?
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <HelpInstallPwa />
                </AccordionDetails>
            </AccordingFaqItem>
            <AccordingFaqItem>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography variant="body1" sx={sharedStyles.heading}>
                        Tsy maintsy misy fahana internet ve vao afaka mampiasa ny LMM-OA?
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <HelpNoInternet />
                </AccordionDetails>
            </AccordingFaqItem>
            <TypographyFaqSubheading>MPIANATRA</TypographyFaqSubheading>
            <AccordingFaqItem>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography variant="body1" sx={sharedStyles.heading}>
                        Ahoana no hahafahan’ny mpianatra mijery fandaharana avy amin’ny internet?
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <HelpStudentsAccessInternet />
                </AccordionDetails>
            </AccordingFaqItem>
            <TypographyFaqSubheading>FANDAMINANA ANJARA</TypographyFaqSubheading>
            <AccordingFaqItem>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography variant="body1" sx={sharedStyles.heading}>
                        Ahoana no fomba handaminana anjara mandritra izao COVID-19 izao?
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <HelpLiveClass />
                </AccordionDetails>
            </AccordingFaqItem>
            <TypographyFaqSubheading>LOHARANON-KEVITRA</TypographyFaqSubheading>
            <AccordingFaqItem>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography variant="body1" sx={sharedStyles.heading}>
                        Ahoana ny fomba fampidirina ireo loharanon-kevitra?
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <HelpUpdateSource />
                </AccordionDetails>
            </AccordingFaqItem>
        </Box>
     );
}
 
export default Help;