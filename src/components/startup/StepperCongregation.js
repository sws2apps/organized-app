import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { congNameState, congNumberState, isErrorCongNameState, isErrorCongNumberState } from '../../appStates/appCongregation';

const StepperCongregation = () => {
    const { t } = useTranslation();

    const [congName, setCongName] = useRecoilState(congNameState);
    const [congNumber, setCongNumber] = useRecoilState(congNumberState);
    const [isErrorCongName, setIsErrorCongName] = useRecoilState(isErrorCongNameState);
    const [isErrorCongNumber, setIsErrorCongNumber] = useRecoilState(isErrorCongNumberState);

    const handleCongNameChange = (value) => {
        if (value) {
            setIsErrorCongName(false);
        } else {
            setIsErrorCongName(true);
        }
        setCongName(value);
    }

    const handleCongNumberChange = (value) => {
        if (value) {
            setIsErrorCongNumber(false);
        } else {
            setIsErrorCongNumber(true);
        }
        setCongNumber(value);
    }

    return ( 
        <div>
            <Typography variant="body2" paragraph>{t("startup.congInfoDescription")}</Typography>
            <TextField
                id="outlined-cong-name"
                label={t("global.congregation")}
                variant="outlined"
                size="small"
                autoComplete='off'
                required
                error={isErrorCongName ? true : false}
                sx={{
                    width: '320px',
                    marginRight: '5px',
                    marginBottom: '10px',
                }}
                value={congName}
                onChange={(e) => handleCongNameChange(e.target.value)}
            />
            <TextField
                id="outlined-cong-number"
                type="number"
                label={t("global.number")}
                variant="outlined"
                size="small"
                autoComplete='off'
                required
                error={isErrorCongNumber ? true : false}
                sx={{width: '120px'}}
                value={congNumber}
                onChange={(e) => handleCongNumberChange(e.target.value)}
            />
        </div>
     );
}
 
export default StepperCongregation;