import Typography from "@mui/material/Typography";
import installBanner from "../../img/installBanner.png";

const HelpInstallPwa = () => {
    return ( 
        <div>
            <Typography gutterBottom>Azonao atao <em>install</em> ao amin’ny fitaovana ampiasainao ny LMM-OA, ka tsy voatery manokatra ny programa fijerenao internet ianao avy eo rehefa hampiasa azy ity.</Typography>
            <Typography>Eo amin’ny farany ambony indrindra, amin’ny sisiny ankavanana no misy ny fanaovana <em>install</em> ny LMM-OA</Typography>
            <img src={installBanner} alt="Install Banner" className="imgHelp" />
            <Typography gutterBottom>Araho avy eo ny toromarika miseho manaraka mandra-pahavitan’ny fampidirana ny programa LMM-OA ao amin’ny fitaovana ampiasainao.</Typography>
            <Typography>Raha tsy miseho io sary io amin’ny fitaovana ampiasainao, dia azonao karohina ao amin’ny internet ny fanaovana <em>install</em> ny programa PWA amin’ny fitaovana sy programa fijerena internet ampiasainao</Typography>
        </div>
     );
}
 
export default HelpInstallPwa;