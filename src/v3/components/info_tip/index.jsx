import PropTypes from 'prop-types';
import {IconInfo} from '@icons';
import { Box } from '@mui/material';
import {  Typography } from '@components';

const InfoTip = ({isBig, text, isWhite, title, icon})  => {

const getColor = () => {
        let result = '';

        if(isWhite){
            result = 'var(--grey-350)';
        }

        if(!isWhite){
            result = 'var(--accent-400)';
        }
    
        if (isWhite&&isBig) {
          result = 'var(--grey-400)';
        }
    
        return result;
      };

return(<>

<Box sx={{
    padding: '16px',
    width: '600px',
    borderRadius: '12px',
    border: isWhite? '1px solid var(--accent-300)': '1px dashed var(--accent-300)',
    bgcolor: isWhite? 'var(--white)': ' var(--accent-150)',
}}> 

{isBig && <Typography variant="h2" sx={{
    color: isWhite? 'var(--black)': ' var(--accent-400)',
    marginBottom: '12px'}}> {title} 
    </Typography>}
<Box sx={{
    display:'flex',
    alignItems:'center',
    gap:'8px'
}}>
{icon && <IconInfo color={getColor()}/>}
<Typography variant='body-regular'
sx={{color: getColor(),}}>{text}
</Typography>
</Box>

</Box>

</>)
  }


  InfoTip.propTypes = {
    isBig: PropTypes.bool.isRequired,
    text:PropTypes.string.isRequired,
    isWhite: PropTypes.bool.isRequired,
    title:PropTypes.string,
    icon:PropTypes.bool.isRequired
  };

  export default InfoTip;