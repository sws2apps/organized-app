import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const isLocalhost = Boolean(
	typeof window !== 'undefined' &&
		(window.location.hostname === 'localhost' ||
			// [::1] is the IPv6 localhost address.
			window.location.hostname === '[::1]' ||
			// 127.0.0.1/8 is considered localhost for IPv4.
			window.location.hostname.match(
				/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
			))
);

const ServiceWorkerWrapper = ({
	children,
	onError,
	onInstalled,
	onUpdated,
	onStaled,
	publicServiceWorkerDest,
	publicUrl,
}) => {
	const [registration, setRegistration] = useState(null);
	const [serviceWorkerUrl] = useState(`${publicUrl}${publicServiceWorkerDest}`);

	const registerValidServiceWorker = useCallback(async () => {
		try {
			let registration = await navigator.serviceWorker.getRegistration();
			if (!registration) {
				registration = await navigator.serviceWorker.register(serviceWorkerUrl);
			}

			// check if there are any awaiting sw
			const waitingWorker = registration.waiting;
			if (waitingWorker && waitingWorker.state === 'installed') {
				onStaled && onStaled();
			}

			setRegistration(registration);

			registration.addEventListener('updatefound', () => {
				const installingWorker = registration.installing;

				if (installingWorker) {
					installingWorker.onstatechange = () => {
						if (installingWorker.state === 'installed') {
							if (navigator.serviceWorker.controller) {
								onUpdated && onUpdated();
							}
							onInstalled && onInstalled();
						}
					};
				}

				const waitingWorker = registration.waiting;
				if (waitingWorker) {
					waitingWorker.onstatechange = () => {
						if (waitingWorker.state === 'installed') {
							if (navigator.serviceWorker.controller) {
								onUpdated && onUpdated();
							}
							onInstalled && onInstalled();
						}
					};
				}
			});
		} catch (err) {
			console.error('Error during service worker registration:', err);
			onError && onError(err);
		}
	}, [serviceWorkerUrl, onError, onStaled, onInstalled, onUpdated]);

	const checkValidServiceWorker = useCallback(async () => {
		try {
			const response = await fetch(serviceWorkerUrl);
			// Ensure service worker exists, and that we really are getting a JS file.
			if (
				response.status === 404 ||
				response.headers.get('content-type').indexOf('javascript') === -1
			) {
				// No service worker found. Probably a different app. Reload the page.
				navigator.serviceWorker.ready.then(async (registration) => {
					await registration.unregister();
					window.location.reload();
				});
			} else {
				// Service worker found. Proceed as normal.
				registerValidServiceWorker();
			}
		} catch (err) {
			console.log(
				'No internet connection found. App is running in offline mode.'
			);
		}
	}, [registerValidServiceWorker, serviceWorkerUrl]);

	const register = useCallback(async () => {
		if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
			// The URL constructor is available in all browsers that support SW.
			const pUrl = new URL(publicUrl, window.location);
			if (pUrl.origin !== window.location.origin) {
				// Our service worker won't work if PUBLIC_URL is on a different origin
				// from what our page is served on. This might happen if a CDN is used to
				// serve assets; see https://github.com/facebookincubator/create-react-app/issues/2374
				return;
			}
			if (isLocalhost) {
				// This is running on localhost. Lets check if a service worker still exists or not.
				checkValidServiceWorker();
				// Add some additional logging to localhost, pointing developers to the
				// service worker/PWA documentation.
				navigator.serviceWorker.ready.then(() => {
					console.log(
						'This web app is being served cache-first by a service ' +
							'worker. To learn more, visit https://goo.gl/SC7cgQ'
					);
				});
			} else {
				// Is not local host. Just register service worker
				registerValidServiceWorker();
			}
		}
	}, [checkValidServiceWorker, publicUrl, registerValidServiceWorker]);

	const unregister = useCallback(() => {
		registration && registration.unregister();
	}, [registration]);

	const update = useCallback(() => {
		registration && registration.update();
		registration.waiting.postMessage({ type: 'SKIP_WAITING' });
	}, [registration]);

	useEffect(() => {
		if (process.env.NODE_ENV === 'production') {
			register();
		}
	}, [register]);

	return typeof children === 'function'
		? children({
				registration,
				register: register,
				update: update,
				unregister: unregister,
		  })
		: children;
};

ServiceWorkerWrapper.propTypes = {
	children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
	onError: PropTypes.func,
	onInstalled: PropTypes.func,
	onUpdated: PropTypes.func,
	onStaled: PropTypes.func,
	publicServiceWorkerDest: PropTypes.string.isRequired,
	publicUrl: PropTypes.string,
};

ServiceWorkerWrapper.defaultProps = {
	onError: null,
	onInstalled: null,
	onUpdated: null,
	onStaled: null,
	publicUrl: '',
};

export default ServiceWorkerWrapper;
