import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

const StepperWelcome = () => {
    const { t } = useTranslation();
    
    return ( 
        <div>
            <Typography variant="body2" paragraph>{t("startup.welcomeDescription")}</Typography>
        </div>
     );
}
 
export default StepperWelcome;