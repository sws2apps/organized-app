import Typography from "@mui/material/Typography";
import appNoInternet from "../../img/appNoInternet.png";

const HelpNoInternet = () => {
    return ( 
        <div>
            <Typography variant="body1" gutterBottom>Tsy mila fahana internet ianao rehefa mampiasa ny LMM-OA. Rehefa manokatra azy voalohany ihany ianao no mila manana fahana. Maka ny rakitra rehetra ilaina mba hampandeha ny LMM-OA rehefa tsy misy internet ny fitaovana ampiasainao aloha. Hisy filazana hiseho eo amin’ny efijery rehefa vita izany.</Typography>
            <img src={appNoInternet} alt="No internet banner" className="imgHelp" />
        </div>
     );
}
 
export default HelpNoInternet;