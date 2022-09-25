import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { isOnlineState } from '../../appStates/appSettings';

const InternetChecker = () => {
	const setIsOnline = useSetRecoilState(isOnlineState);

	useEffect(() => {
		window.addEventListener('online', (e) => {
			setIsOnline(true);
		});

		window.addEventListener('offline', (e) => {
			setIsOnline(false);
		});
	}, [setIsOnline]);
	return <></>;
};

export default InternetChecker;
