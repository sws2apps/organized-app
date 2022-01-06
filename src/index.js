import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import RecoilOutside from 'recoil-outside';
import './i18n';
import App from './App';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/global.css';

ReactDOM.render(
	<React.StrictMode>
		<RecoilRoot>
			<RecoilOutside />
			<App />
		</RecoilRoot>
	</React.StrictMode>,
	document.getElementById('root')
);
