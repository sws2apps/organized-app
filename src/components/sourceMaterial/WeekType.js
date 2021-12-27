import { useEffect, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { dbGetListWeekType } from '../../indexedDb/dbSourceMaterial';
    
const WeekType = (props) => {
    const {weekType, setWeekType} = props;
    const [weekTypes, setWeekTypes] = useState([]);

    const handleTypeChange = async (e) => {
        setWeekType(e.target.value);
        if (e.target.value === 3) {
            props.setHasMeeting(false)
        } else {
            props.setHasMeeting(true)
        }
    }

    const renderWeekType = type => {
        return (
            <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
        );
    }

    useEffect(() => {
        const loadWeekType = async () => {
            const types = await dbGetListWeekType();
            setWeekTypes(types);
        }
        loadWeekType();
        return (() => {
            //clean
        })
    }, [weekType])

    return ( 
        <>
            {weekTypes.length > 0 && (
                <TextField
                    id="outlined-select-weekType"
                    select
                    label="Karazany"
                    size="small"
                    value={weekType}
                    onChange={(e) => handleTypeChange(e)}
                    sx={{
                        minWidth: '140px',
                        margin: '5px 5px 10px 0',
                    }}
                >
                    {weekTypes.map(weekType => renderWeekType(weekType))}
                </TextField>
            )}
        </>
     );
}
 
export default WeekType;