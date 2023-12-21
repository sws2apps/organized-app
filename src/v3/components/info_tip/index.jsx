import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import {  Typography } from '@components';


const InfoTip = ({isBig, text, title, icon, color})  => {
 
const getColorStyle = () => {
  
    const result = {
        border: '',
        background: '',
        text: '',
        title: '',
      };
    
      if (color === 'white') {
        result.border = '1px solid var(--accent-300)';
        result.background = 'var(--white)';
        result.text = isBig ? 'var(--grey-400)' : 'var(--grey-350)';
        result.title = isBig ? 'var(--black)' : '';
      } else if (color === 'blue') {
        result.border = '1px dashed var(--accent-300)';
        result.background = 'var(--accent-150)';
        result.text = 'var(--accent-400)';
        result.title = isBig ? 'var(--accent-400)' : '';
      }
    
     return result;
};

const style = getColorStyle();

return(<>
<Box sx={{
    padding: '16px',
    width: '600px',
    borderRadius: 'var(--radius-xl)',
    border: style.border,
    bgcolor:style.background
}}> 

{isBig && <Typography variant="h2" sx={{
    color: style.title,
    marginBottom: '12px'}}> 
    {title} 
 </Typography>}

<Box sx={{
    display:'flex',
    alignItems:'center',
    gap:'8px'}}>


<Box
  sx={{
    '& svg': {
    '& g, & path': {
        fill: style.text,
      },
    },
  }}
>
  {icon}
</Box>



<Typography variant='body-regular'
sx={{color: style.text}}
>
{text}
</Typography>
</Box>

</Box>
</>)}


  InfoTip.propTypes = {
    isBig: PropTypes.bool.isRequired,
    text:PropTypes.string.isRequired,
    title:PropTypes.string,
    icon: PropTypes.element,
    color:PropTypes.string,
  };

export default InfoTip;