import { useRecoilState, useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { isPrecachedState, showReloadState } from '../../appStates/appSettings';

const ServiceWorkerWrapper = ({ enabledInstall, updatePwa }) => {
	const { t } = useTranslation();

	const [isPrecached, setIsPrecached] = useRecoilState(isPrecachedState);

	const showReload = useRecoilValue(showReloadState);

	const reloadPage = () => {
		updatePwa();
		window.location.reload();
	};

	return (
		<>
			<Snackbar
				open={showReload}
				message={t('global.newVersion')}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				action={
					<Button color='inherit' size='small' onClick={reloadPage}>
						{t('global.updateApp')}
					</Button>
				}
			/>
			<Snackbar
				open={isPrecached && enabledInstall && !showReload}
				message={t('global.cacheCompleted')}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				action={
					<Button
						color='inherit'
						size='small'
						onClick={() => setIsPrecached(false)}
					>
						OK
					</Button>
				}
			/>
		</>
	);
};

export default ServiceWorkerWrapper;
