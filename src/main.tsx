import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as StoreProvider } from 'react-redux';
import '@/styles/globals.css';
import { SnackbarProvider } from 'notistack';

import App from './App';

import { store } from '@/store.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<StoreProvider store={store}>
			<App />
		</StoreProvider>
		<SnackbarProvider />
	</React.StrictMode>,
);
