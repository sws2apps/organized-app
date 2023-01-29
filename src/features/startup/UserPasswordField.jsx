import TextField from '@mui/material/TextField';

const UserPasswordField = ({ label, showPwd, userPwd, setUserPwd, hasErrorPwd }) => {
  return (
    <TextField
      sx={{ marginTop: '20px', width: '100%' }}
      label={label}
      type={showPwd ? '' : 'password'}
      variant="outlined"
      autoComplete="off"
      required
      value={userPwd}
      onChange={(e) => setUserPwd(e.target.value)}
      error={hasErrorPwd ? true : false}
    />
  );
};

export default UserPasswordField;
