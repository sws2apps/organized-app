import { useRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import FlashAutoIcon from '@mui/icons-material/FlashAuto';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { isErrorPersoCodeState, userPersoCodeState } from '../../appStates/appMe';

const StepperAboutMe = () => {
    const [persoCode, setPersoCode] = useRecoilState(userPersoCodeState);
    const [isErrorPersoCode, setIsErrorPersoCode] = useRecoilState(isErrorPersoCodeState);

    const handleGeneratePersoCode = () => {
        var min = 1000000000;
        var max = 9999999999;
        var num = Math.floor(Math.random() * (max - min + 1)) + min;

        handlePersoCodeChange(num);
    }

    const handlePersoCodeChange = (value) => {
        if (value && value.toString().length >= 6) {
            setIsErrorPersoCode(false);
        } else {
            setIsErrorPersoCode(true);
        }
        setPersoCode(value);
    }

    return ( 
        <Box>
            <Typography variant="body2" paragraph>Mamorona kaody ho anao manokana, rehefa mampiasa ny LMM-OA. Tehirizo tsara io kaody io avy eo. Raha efa manana kaody kosa ianao, dia azonao tonga dia ampidirina eo ambany izany.</Typography>
            <Input
                id="outlined-basic"
                placeholder="Kaody Manokana"
                size="small"
                autoComplete='off'
                required
                error={isErrorPersoCode ? true : false}
                type="number"
                sx={{
                    width: '180px',
                    marginBottom: '10px',
                }}
                value={persoCode}
                onChange={(e) => handlePersoCodeChange(e.target.value)}
            />
            {persoCode === "" && (
                <IconButton
                    sx={{ padding: '1px'}}
                    onClick={() => handleGeneratePersoCode()}
                >
                    <FlashAutoIcon sx={{fontSize: '36px'}} />
                </IconButton>
            )}
        </Box>
     );
}
 
export default StepperAboutMe;