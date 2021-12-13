import Typography from "@mui/material/Typography";
import studentAccessInternet from "../../img/studentAccessInternet.png";

const HelpStudentsAccessInternet = () => {
    return ( 
        <div>
            <Typography gutterBottom>Afaka mijery ny fandaharana alefa internet amin’ny alalan’ny programa <strong>SWS Pocket</strong> ny mpianatra. Mila omena alalana anefa aloha ny mpianatra vao afaka mijery ny fandaharana amin’io programa io.</Typography>
            <Typography gutterBottom>Raha efa mandeha ilay hoe hampiasa internet any amin’ny Fanamboarana, dia hiseho ireto fanazavana ireto rehefa jerena ny mombamomba ny mpianatra:</Typography>
            <img src={studentAccessInternet} alt="Student Access Internet" className="imgHelp" />
            <Typography gutterBottom><strong>Kaody manokana:</strong> Kaody manokana omena ny mpianatra io mba ahafahana mampiasa ny programa <strong>SWS Pocket</strong>. Raha efa manana kaody ny mpianatra, dia ampidiro eo avy hatrany izany, fa raha mbola tsy manana kosa izy, dia tsindrio ilay bokotra eo ankavanana.</Typography>
            <Typography gutterBottom><strong>Anjaran’ny mpianatra hafa azony jerena:</strong> Afaka ampidirina eo hoe anjaran’iza avy no azon’ilay mpianatra jerena, ohatra hoe ny fianakaviany. Hiseho ao amin’ny programa <strong>SWS Pocket</strong> avy eo ny anjaran’izy ireo.</Typography>
        </div>
     );
}
 
export default HelpStudentsAccessInternet;