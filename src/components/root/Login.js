import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { apiHostState, isLoginOpenState, uidUserState } from '../../appStates/appSettings';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../appStates/appNotification';

const Login = () => {
    const [isNewAccount, setIsNewAccount] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [verifyLink, setVerifyLink] = useState('');
    const [isLogin, setIsLogin] = useState(false);

    const [isOpen, setIsOpen] = useRecoilState(isLoginOpenState);

    const apiHost = useRecoilValue(apiHostState);
    const setUidUser = useSetRecoilState(uidUserState);
    const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
    const setAppSeverity = useSetRecoilState(appSeverityState);
    const setAppMessage = useSetRecoilState(appMessageState);

    const { t } = useTranslation();

    const handleClose = (event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
        }
        setIsOpen(false);
    };

    const handleLogin = async () => {
        setIsProcessing(true);
        const reqPayload = {
            email: email,
            password: password,
        }

        if (apiHost !== '') {
            fetch(`${apiHost}api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqPayload),
            })
            .then(async (res) => {
                const data = await res.json();
                if (res.status === 200) {
                    if (data.verified) {
                        setIsCompleted(true);
                        setIsProcessing(false);
                        setUidUser(data.message);
                        handleClose();
                    } else {
                        setIsLogin(true);
                        if (data.message !== 'VERIFY_FAILED') {
                            setVerifyLink(data.message);
                        }
                        setIsCompleted(true);
                        setIsProcessing(false);
                    }                    
                } else {
                    let warnMsg = '';
                    if (data.message === 'EMAIL_NOT_FOUND' || data.message === 'INVALID_EMAIL' || data.message === 'INVALID_PASSWORD' || data.message === 'MISSING_EMAIL') {
                        warnMsg = t("login.accountNotFound")
                    } else if (data.message === 'USER_DISABLED') {
                        warnMsg = t("login.accountDisabled")
                    } else {
                        warnMsg = data.message;
                    }
                    setIsProcessing(false);
                    setAppMessage(warnMsg);
                    setAppSeverity('warning')
                    setAppSnackOpen(true);
                }
            })
            .catch((err) => {
                setIsProcessing(false);
                setAppMessage(err.message);
                setAppSeverity('error');
                setAppSnackOpen(true);
            })
        }
    }

    const handleCreateAccount = async () => {
        setIsProcessing(true);
        const reqPayload = {
            email: email,
            password: password,
        }

        if (apiHost !== '') {
            fetch(`${apiHost}api/create-account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqPayload),
            })
            .then(async (res) => {
                const data = await res.json();
                if (res.status === 200) {
                    if (data.message !== 'VERIFY_FAILED') {
                        setVerifyLink(data.message);
                    }
                    setIsCompleted(true);
                    setIsProcessing(false);
                } else {
                    setIsProcessing(false);
                    setAppMessage(data.message);
                    setAppSeverity('warning')
                    setAppSnackOpen(true);
                }
            })
            .catch((err) => {
                setIsProcessing(false);
                setAppMessage(err.message);
                setAppSeverity('error')
                setAppSnackOpen(true);
            })
        }
    }

    const handleTypeLoginCheck = (e) => {
        setIsNewAccount(e.target.checked);
        setPassword('');
        setConfPassword('');
    }

    useEffect(() => {
        if (email.length > 0 ) {
            if (isNewAccount) {
                if (password.length > 0 && password === confPassword) {
                    setBtnDisabled(false)
                } else {
                    setBtnDisabled(true)
                }
            } else {
                if (password.length > 0) {
                    setBtnDisabled(false)
                } else {
                    setBtnDisabled(true)
                }
            }
        } else {
            setBtnDisabled(true)
        }
    }, [isNewAccount, email, password, confPassword])

    return ( 
        <Dialog
            open={isOpen}
            onClose={handleClose}
        >
            <DialogTitle
                sx={{
                    padding: 0,
                    position: 'absolute',
                    right: 0,
                }}
            >
                <IconButton
                    color="inherit"
                    edge="start"
                    sx={{marginRight: '8px'}}
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent
                sx={{
                    padding: '10px',
                    marginTop: '15px'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: '15px',
                    }}
                >
                    <img src="/img/appLogo.png" alt="App logo" className="appLogoMini" />
                    <Typography
                        sx={{
                            fontWeight: 'bold',
                            marginTop: '5px',
                        }}
                    >
                        LMM-OA
                    </Typography>
                </Box>
                {!isCompleted && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            id="login-email-outlined"
                            label={t("login.email")}
                            variant="outlined"
                            size="small"
                            autoComplete='off'
                            required
                            sx={{
                                width: '250px',
                                marginBottom: '15px',
                            }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            id="login-password-outlined"
                            type="password"
                            label={t("login.password")}
                            variant="outlined"
                            size="small"
                            autoComplete='off'
                            required
                            sx={{
                                width: '250px',
                                marginBottom: '15px',
                            }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {isNewAccount && (
                            <TextField
                                id="login-confirm-password-outlined"
                                type="password"
                                label={t("login.confirmPassword")}
                                variant="outlined"
                                size="small"
                                autoComplete='off'
                                required
                                sx={{
                                    width: '250px',
                                    marginBottom: '15px',
                                }}
                                value={confPassword}
                                onChange={(e) => setConfPassword(e.target.value)}
                            />
                        )}
                    </Box>
                )}
                {isProcessing && (
                    <Container
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <CircularProgress disableShrink color="secondary" size={'40px'} />
                    </Container>
                )}
                {!isProcessing && (
                    <>
                        {isCompleted && (
                            <>
                                {isLogin && (
                                    <>
                                        {verifyLink.length === 0 && (
                                            <Typography sx={{width: '250px'}}>{t("login.accountNotVerifiedNoLink")}</Typography>
                                        )}
                                        {verifyLink.length > 0 && (
                                            <Typography sx={{width: '250px'}}>{t("login.accountNotVerified")}<Link href={verifyLink}>{t("login.accountActivate")}</Link>.</Typography>
                                        )}
                                    </>
                                )}
                                {!isLogin && (
                                    <>
                                        {verifyLink.length === 0 && (
                                            <Typography sx={{width: '250px'}}>{t("login.accountCreateWithoutLink")}</Typography>
                                        )}
                                        {verifyLink.length > 0 && (
                                            <Typography sx={{width: '250px'}}>{t("login.accountCreateWithLink")}<Link href={verifyLink}>{t("login.accountActivate")}</Link>.</Typography>
                                        )}
                                    </>
                                )}
                                
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}
                                >
                                    <CheckCircleIcon
                                        color="success"
                                        sx={{
                                            fontSize: '40px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={handleClose}
                                    />
                                </Box>
                            </>
                        )}
                        {!isCompleted && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <FormGroup sx={{marginLeft: '5px', marginTop: '10px'}}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={isNewAccount}
                                                onChange={handleTypeLoginCheck}
                                                sx={{padding: '3px'}}
                                            />
                                        }
                                        label={
                                            <Typography
                                                sx={{
                                                    fontSize: '12px',
                                                }}
                                            >
                                                {t("login.newAccount")}
                                            </Typography>
                                        }
                                    />
                                </FormGroup>
                                <Button
                                    disabled={btnDisabled}
                                    sx={{
                                        marginTop: '10px',
                                    }}
                                    onClick={isNewAccount ? handleCreateAccount : handleLogin}
                                >
                                    {isNewAccount ? t("login.createAccount") : t("global.login")}
                                </Button>
                            </Box>
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
     );
}
 
export default Login;