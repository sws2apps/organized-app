import PropTypes from 'prop-types';
import {IconInfo} from '@icons';
import { Box } from '@mui/material';
import {  Typography } from '@components';

const InfoTip = ({isBig, text, title, icon, colors})  => {

return(<>
<Box sx={{
    padding: '16px',
    width: '600px',
    borderRadius: 'var(--radius-xl)',
    border: colors.border,
    bgcolor:colors.background
}}> 

{isBig && <Typography variant="h2" sx={{
    color: colors.title,
    marginBottom: '12px'}}> 
    {title} 
 </Typography>}

<Box sx={{
    display:'flex',
    alignItems:'center',
    gap:'8px'}}>

{icon && <IconInfo color={colors.text}/>}

<Typography variant='body-regular'
sx={{color: colors.text}}>
{text}
</Typography>
</Box>

</Box>
</>)}


  InfoTip.propTypes = {
    isBig: PropTypes.bool.isRequired,
    text:PropTypes.string.isRequired,
    title:PropTypes.string,
    icon:PropTypes.bool.isRequired,
    colors: PropTypes.shape({
          border: PropTypes.string.isRequired,
          background: PropTypes.string.isRequired,
          text: PropTypes.string.isRequired,
          title: PropTypes.string,
        }).isRequired,
  };

export default InfoTip;