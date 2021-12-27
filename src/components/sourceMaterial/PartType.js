import { useEffect, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { dbGetListAssType } from "../../indexedDb/dbAssignment";

const PartType = (props) => {
    const [partTypes, setPartTypes] = useState([]);
    const [type, setType] = useState("");

    const handleChangeType = (e) => {
        setType(e.target.value);
        if (props.ayf === 1) {
            props.setAss1Type(e.target.value);
        } else if (props.ayf === 2) {
            props.setAss2Type(e.target.value);
        } else if (props.ayf === 3) {
            props.setAss3Type(e.target.value);
        } else if (props.ayf === 4) {
            props.setAss4Type(e.target.value);
        }
    }

    const renderPartType = type => {
        return (
            <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
        );
    }

    useEffect(() => {
        const loadPartType = async () => {
            const types = await dbGetListAssType();
            setPartTypes(types);
        }
        loadPartType();
        setType(props.assType);
        return (() => {
            //clean
        })
    }, [props.assType])

    return ( 
        <>
            {partTypes.length > 0 && (
                <TextField
                    id="outlined-select-type"
                    select
                    label="Anjara"
                    size="small"
                    value={type}
                    onChange={(e) => handleChangeType(e)}
                    sx={{
                        minWidth: '250px',
                        marginBottom: '20px',
                        marginRight: '5px',
                    }}
                >
                        <MenuItem value={""}><em>Tsy misy</em></MenuItem>
                        {partTypes.map(partType => renderPartType(partType))}
                </TextField>
            )}
        </>
     );
}
 
export default PartType;