import { configureStore } from '@reduxjs/toolkit';

import { reducer as sessionReducer } from '@/stores/session';
import { reducer as channelsReducer } from '@/stores/channels';

export const store = configureStore({
	reducer: {
		session: sessionReducer,
		channels: channelsReducer,
	},
	devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
